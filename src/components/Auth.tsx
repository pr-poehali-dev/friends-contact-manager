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
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const getUsers = (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast.error('Заполните все поля');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);

    if (user) {
      toast.success(`Добро пожаловать, ${user.name}!`);
      onLogin(loginEmail);
    } else {
      toast.error('Неверный email или пароль');
    }
  };

  const handleRegister = () => {
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      toast.error('Введите корректный email');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === registerEmail)) {
      toast.error('Пользователь с таким email уже существует');
      return;
    }

    const newUser: User = {
      email: registerEmail,
      password: registerPassword,
      name: registerName
    };

    users.push(newUser);
    saveUsers(users);
    toast.success('Регистрация успешна!');
    onLogin(registerEmail);
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
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="mt-1"
                  />
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
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="Повторите пароль"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    className="mt-1"
                  />
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
