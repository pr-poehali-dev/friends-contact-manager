import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newContact: {
    name: string;
    phone: string;
    email: string;
    group: string;
  };
  onContactChange: (contact: { name: string; phone: string; email: string; group: string }) => void;
  onSave: () => void;
  groups: string[];
}

const AddContactDialog = ({ 
  isOpen, 
  onOpenChange, 
  newContact, 
  onContactChange, 
  onSave, 
  groups 
}: AddContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e) => onContactChange({ ...newContact, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              placeholder="+7 999 123-45-67"
              value={newContact.phone}
              onChange={(e) => onContactChange({ ...newContact, phone: e.target.value })}
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
              onChange={(e) => onContactChange({ ...newContact, email: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="group">Группа</Label>
            <select
              id="group"
              value={newContact.group}
              onChange={(e) => onContactChange({ ...newContact, group: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            >
              {groups.slice(1).map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <Button onClick={onSave} className="w-full bg-gradient-to-r from-primary to-secondary">
            Сохранить контакт
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
