import { useState, FormEvent } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import './UserInviteForm.css';

export function UserInviteForm() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    function: '',
    roleId: 'role-user',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.function.trim()) {
      newErrors.function = 'Job function is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      function: formData.function.trim(),
      roleId: formData.roleId,
      groupIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_USER', payload: newUser });

    toast({
      title: 'User invited successfully',
      description: `${newUser.firstName} ${newUser.lastName} has been added to the system.`,
    });

    // Clear form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      function: '',
      roleId: 'role-user',
    });
    setErrors({});
  };

  return (
    <Card className="user-invite-form">
      <CardHeader>
        <CardTitle className="user-invite-form__title">
          <UserPlus size={20} strokeWidth={1.5} />
          Invite New User
        </CardTitle>
        <CardDescription>Add a new user to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="user-invite-form__form">
          <div className="user-invite-form__field">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={errors.firstName ? 'user-invite-form__input--error' : ''}
            />
            {errors.firstName && (
              <span className="user-invite-form__error">{errors.firstName}</span>
            )}
          </div>

          <div className="user-invite-form__field">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={errors.lastName ? 'user-invite-form__input--error' : ''}
            />
            {errors.lastName && (
              <span className="user-invite-form__error">{errors.lastName}</span>
            )}
          </div>

          <div className="user-invite-form__field">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'user-invite-form__input--error' : ''}
            />
            {errors.email && (
              <span className="user-invite-form__error">{errors.email}</span>
            )}
          </div>

          <div className="user-invite-form__field">
            <Label htmlFor="function">Job Function *</Label>
            <Input
              id="function"
              type="text"
              value={formData.function}
              onChange={(e) => setFormData({ ...formData, function: e.target.value })}
              placeholder="e.g., Project Manager, Engineer"
              className={errors.function ? 'user-invite-form__input--error' : ''}
            />
            {errors.function && (
              <span className="user-invite-form__error">{errors.function}</span>
            )}
          </div>

          <div className="user-invite-form__field">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value: string) => setFormData({ ...formData, roleId: value })}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="user-invite-form__submit">
            <UserPlus size={16} strokeWidth={1.5} />
            Invite User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
