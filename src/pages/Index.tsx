import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isFavorite: boolean;
  group: string;
}

const STORAGE_KEY = 'contacts-app-data';

const getInitialContacts = (): Contact[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [
    {
      id: '1',
      name: 'Анна Петрова',
      phone: '+7 999 123-45-67',
      email: 'anna@example.com',
      isFavorite: true,
      group: 'Работа'
    },
    {
      id: '2',
      name: 'Дмитрий Иванов',
      phone: '+7 999 234-56-78',
      email: 'dmitry@example.com',
      isFavorite: false,
      group: 'Друзья'
    },
    {
      id: '3',
      name: 'Мария Сидорова',
      phone: '+7 999 345-67-89',
      email: 'maria@example.com',
      isFavorite: true,
      group: 'Семья'
    },
    {
      id: '4',
      name: 'Алексей Козлов',
      phone: '+7 999 456-78-90',
      email: 'alexey@example.com',
      isFavorite: false,
      group: 'Друзья'
    }
  ];
};

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>(getInitialContacts);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    group: 'Друзья'
  });

  const groups = ['Все', 'Работа', 'Друзья', 'Семья', 'Учеба'];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'favorites') return matchesSearch && contact.isFavorite;
    return matchesSearch && contact.group === selectedTab;
  });

  const toggleFavorite = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isFavorite: !contact.isFavorite } : contact
    ));
    toast.success('Избранное обновлено');
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Заполните имя и телефон');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      isFavorite: false,
      group: newContact.group
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', email: '', group: 'Друзья' });
    setIsAddDialogOpen(false);
    toast.success('Контакт добавлен!');
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Контакт удален');
  };

  const handleEditContact = () => {
    if (!editingContact || !editingContact.name || !editingContact.phone) {
      toast.error('Заполните имя и телефон');
      return;
    }

    setContacts(contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ));
    setEditingContact(null);
    setIsEditDialogOpen(false);
    toast.success('Контакт обновлен!');
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact({ ...contact });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                Мои Контакты
              </h1>
              <p className="text-muted-foreground">Управляй своими друзьями легко</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                  <Icon name="UserPlus" className="mr-2" size={20} />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Новый контакт</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      placeholder="+7 999 123-45-67"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group">Группа</Label>
                    <select
                      id="group"
                      value={newContact.group}
                      onChange={(e) => setNewContact({ ...newContact, group: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                    >
                      {groups.slice(1).map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleAddContact} className="w-full bg-gradient-to-r from-primary to-secondary">
                    Сохранить контакт
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Поиск по имени, телефону или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg shadow-md border-2 focus:border-primary"
            />
          </div>
        </header>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="w-full justify-start bg-white/60 backdrop-blur-sm p-2 rounded-2xl shadow-md flex-wrap h-auto gap-2">
            <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="Users" className="mr-2" size={16} />
              Все ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-accent data-[state=active]:text-white">
              <Icon name="Star" className="mr-2" size={16} />
              Избранное ({contacts.filter(c => c.isFavorite).length})
            </TabsTrigger>
            {groups.slice(1).map(group => (
              <TabsTrigger key={group} value={group} className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                {group} ({contacts.filter(c => c.group === group).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {filteredContacts.length === 0 ? (
              <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-2">
                <Icon name="UserX" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Контакты не найдены</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact, index) => (
                  <Card 
                    key={contact.id} 
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(contact.id)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Icon 
                            name="Star" 
                            size={20} 
                            className={contact.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
                          />
                        </Button>
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2">{contact.name}</h3>
                      <Badge className="mb-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                        {contact.group}
                      </Badge>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="Phone" size={16} className="text-primary" />
                          <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                            {contact.phone}
                          </a>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Icon name="Mail" size={16} className="text-secondary" />
                            <a href={`mailto:${contact.email}`} className="hover:text-secondary transition-colors">
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-primary hover:text-white transition-colors"
                          onClick={() => window.location.href = `tel:${contact.phone}`}
                        >
                          <Icon name="Phone" size={16} className="mr-1" />
                          Позвонить
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(contact)}
                          className="hover:bg-secondary hover:text-white transition-colors"
                        >
                          <Icon name="Pencil" size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteContact(contact.id)}
                          className="hover:bg-destructive hover:text-white transition-colors"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Редактировать контакт</DialogTitle>
            </DialogHeader>
            {editingContact && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="edit-name">Имя *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Иван Иванов"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Телефон *</Label>
                  <Input
                    id="edit-phone"
                    placeholder="+7 999 123-45-67"
                    value={editingContact.phone}
                    onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="email@example.com"
                    value={editingContact.email}
                    onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-group">Группа</Label>
                  <select
                    id="edit-group"
                    value={editingContact.group}
                    onChange={(e) => setEditingContact({ ...editingContact, group: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  >
                    {groups.slice(1).map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleEditContact} className="w-full bg-gradient-to-r from-primary to-secondary">
                  Сохранить изменения
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;