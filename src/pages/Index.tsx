import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Auth from '@/components/Auth';
import ContactsHeader from '@/components/ContactsHeader';
import ContactCard from '@/components/ContactCard';
import AddContactDialog from '@/components/AddContactDialog';
import EditContactDialog from '@/components/EditContactDialog';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isFavorite: boolean;
  group: string;
}

const CURRENT_USER_KEY = 'contacts-app-current-user';
const USER_CONTACTS_PREFIX = 'contacts-app-user-';

const getInitialContacts = (userEmail: string | null): Contact[] => {
  if (!userEmail) return [];
  
  const stored = localStorage.getItem(USER_CONTACTS_PREFIX + userEmail);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      return [];
    }
  }
  
  const defaultContacts = [
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
  
  localStorage.setItem(USER_CONTACTS_PREFIX + userEmail, JSON.stringify(defaultContacts));
  return defaultContacts;
};

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_KEY);
  });
  const [contacts, setContacts] = useState<Contact[]>(() => getInitialContacts(currentUser));

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
    if (currentUser) {
      localStorage.setItem(USER_CONTACTS_PREFIX + currentUser, JSON.stringify(contacts));
    }
  }, [contacts, currentUser]);

  const handleLogin = (email: string) => {
    localStorage.setItem(CURRENT_USER_KEY, email);
    setCurrentUser(email);
    const userContacts = getInitialContacts(email);
    setContacts(userContacts);
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setContacts([]);
    toast.success('Вы вышли из аккаунта');
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

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

  const exportContacts = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Контакты экспортированы!');
  };

  const importContacts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Contact[];
        if (Array.isArray(imported)) {
          setContacts(imported);
          toast.success(`Импортировано ${imported.length} контактов!`);
        } else {
          toast.error('Неверный формат файла');
        }
      } catch {
        toast.error('Ошибка чтения файла');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ContactsHeader 
          currentUser={currentUser}
          onLogout={handleLogout}
          onExport={exportContacts}
          onImport={importContacts}
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        <div className="relative mb-8">
          <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Поиск по имени, телефону или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg shadow-md border-2 focus:border-primary"
          />
        </div>

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
                  <ContactCard 
                    key={contact.id}
                    contact={contact}
                    index={index}
                    onToggleFavorite={toggleFavorite}
                    onEdit={openEditDialog}
                    onDelete={deleteContact}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AddContactDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newContact={newContact}
          onContactChange={setNewContact}
          onSave={handleAddContact}
          groups={groups}
        />

        <EditContactDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingContact={editingContact}
          onContactChange={setEditingContact}
          onSave={handleEditContact}
          groups={groups}
        />
      </div>
    </div>
  );
};

export default Index;
