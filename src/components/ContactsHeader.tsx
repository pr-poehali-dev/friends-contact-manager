import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface ContactsHeaderProps {
  currentUser: string;
  onLogout: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

const ContactsHeader = ({ currentUser, onLogout, onExport, onImport, onAddClick }: ContactsHeaderProps) => {
  return (
    <header className="mb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Мои Контакты
          </h1>
          <p className="text-muted-foreground">Управляй своими друзьями легко</p>
          <p className="text-sm text-muted-foreground mt-1">
            <Icon name="User" size={14} className="inline mr-1" />
            {currentUser}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="lg"
            onClick={onLogout}
            className="border-2 hover:border-destructive transition-colors"
          >
            <Icon name="LogOut" className="mr-2" size={20} />
            Выйти
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onExport}
            className="border-2 hover:border-primary transition-colors"
          >
            <Icon name="Download" className="mr-2" size={20} />
            Экспорт
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById('import-file')?.click()}
            className="border-2 hover:border-secondary transition-colors"
          >
            <Icon name="Upload" className="mr-2" size={20} />
            Импорт
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg hover:shadow-xl" onClick={onAddClick}>
            <Icon name="UserPlus" className="mr-2" size={20} />
            Добавить
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ContactsHeader;
