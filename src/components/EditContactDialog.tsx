import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isFavorite: boolean;
  group: string;
}

interface EditContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingContact: Contact | null;
  onContactChange: (contact: Contact) => void;
  onSave: () => void;
  groups: string[];
}

const EditContactDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingContact, 
  onContactChange, 
  onSave, 
  groups 
}: EditContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                onChange={(e) => onContactChange({ ...editingContact, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Телефон *</Label>
              <Input
                id="edit-phone"
                placeholder="+7 999 123-45-67"
                value={editingContact.phone}
                onChange={(e) => onContactChange({ ...editingContact, phone: e.target.value })}
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
                onChange={(e) => onContactChange({ ...editingContact, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-group">Группа</Label>
              <select
                id="edit-group"
                value={editingContact.group}
                onChange={(e) => onContactChange({ ...editingContact, group: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                {groups.slice(1).map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <Button onClick={onSave} className="w-full bg-gradient-to-r from-primary to-secondary">
              Сохранить изменения
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
