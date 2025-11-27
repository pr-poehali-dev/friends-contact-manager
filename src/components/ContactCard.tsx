import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isFavorite: boolean;
  group: string;
}

interface ContactCardProps {
  contact: Contact;
  index: number;
  onToggleFavorite: (id: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactCard = ({ contact, index, onToggleFavorite, onEdit, onDelete }: ContactCardProps) => {
  return (
    <Card 
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
            onClick={() => onToggleFavorite(contact.id)}
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
            onClick={() => onEdit(contact)}
            className="hover:bg-secondary hover:text-white transition-colors"
          >
            <Icon name="Pencil" size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(contact.id)}
            className="hover:bg-destructive hover:text-white transition-colors"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
