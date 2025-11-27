import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AuthProps {
  onLogin: (email: string) => void;
}

interface User {
  email: string;
  password: string;
  name: string;
}

const USERS_KEY = 'contacts-app-users';

const Auth = ({ onLogin }: AuthProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const getUsers = (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const handleLogin = () => {
    const trimmedEmail = loginEmail.trim();
    const trimmedPassword = loginPassword.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Заполните все поля');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === trimmedEmail && u.password === trimmedPassword);

    if (user) {
      toast.success(`Добро пожаловать, ${user.name}!`);
      onLogin(trimmedEmail);
    } else {
      toast.error('Неверный email или пароль');
    }
  };

  const handleRegister = () => {
    const trimmedName = registerName.trim();
    const trimmedEmail = registerEmail.trim();
    const trimmedPassword = registerPassword.trim();
    const trimmedConfirmPassword = registerConfirmPassword.trim();
    
    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Введите корректный email');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === trimmedEmail)) {
      toast.error('Пользователь с таким email уже существует');
      return;
    }

    const newUser: User = {
      email: trimmedEmail,
      password: trimmedPassword,
      name: trimmedName
    };

    users.push(newUser);
    saveUsers(users);
    toast.success('Регистрация успешна!');
    onLogin(trimmedEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-4 shadow-xl">
            <Icon name="Users" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Мои Контакты
          </h1>
          <p className="text-muted-foreground">Твой персональный менеджер контактов</p>
        </div>

        <Card className="border-2 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Добро пожаловать!</CardTitle>
            <CardDescription>Войдите в аккаунт или создайте новый</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                  Вход
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                  Регистрация
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Пароль</Label>
                  <div className="relative mt-1">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showLoginPassword ? "EyeOff" : "Eye"} size={18} />
                    </button>
                  </div>
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg"
                >
                  <Icon name="LogIn" className="mr-2" size={18} />
                  Войти
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Имя</Label>
                  <Input
                    id="register-name"
                    placeholder="Иван Иванов"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Пароль</Label>
                  <div className="relative mt-1">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Минимум 6 символов"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showRegisterPassword ? "EyeOff" : "Eye"} size={18} />
                    </button>
                  </div>
                  {registerPassword.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        <div className={`h-1 flex-1 rounded-full transition-all ${registerPassword.length >= 1 ? (registerPassword.length < 6 ? 'bg-red-500' : registerPassword.length < 8 ? 'bg-yellow-500' : registerPassword.length < 12 ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full transition-all ${registerPassword.length >= 8 ? (registerPassword.length < 12 ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full transition-all ${registerPassword.length >= 12 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {registerPassword.length < 6 && 'Слабый пароль'}
                        {registerPassword.length >= 6 && registerPassword.length < 8 && 'Средний пароль'}
                        {registerPassword.length >= 8 && registerPassword.length < 12 && 'Хороший пароль'}
                        {registerPassword.length >= 12 && 'Отличный пароль!'}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                  <div className="relative mt-1">
                    <Input
                      id="register-confirm"
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showRegisterConfirmPassword ? "EyeOff" : "Eye"} size={18} />
                    </button>
                  </div>
                </div>
                <Button 
                  onClick={handleRegister} 
                  className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-all shadow-lg"
                >
                  <Icon name="UserPlus" className="mr-2" size={18} />
                  Зарегистрироваться
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Все данные хранятся локально в вашем браузере
        </p>
      </div>
    </div>
  );
};

export default Auth;