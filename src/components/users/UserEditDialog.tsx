import { useState, useEffect } from 'react';
import { UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import './UserEditDialog.css';

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
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

  // Pre-populate form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        function: user.function,
        roleId: user.roleId,
      });
      setErrors({});
    }
  }, [user]);

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

  const handleSave = () => {
    if (!user || !validateForm()) {
      return;
    }

    const updatedUser: User = {
      ...user,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      function: formData.function.trim(),
      roleId: formData.roleId,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    toast({
      title: 'User updated successfully',
      description: `Changes to ${updatedUser.firstName} ${updatedUser.lastName} have been saved.`,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="user-edit-dialog">
        <DialogHeader>
          <DialogTitle className="user-edit-dialog__title">
            <UserCog size={20} strokeWidth={1.5} />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="user-edit-dialog__form">
          <div className="user-edit-dialog__field">
            <Label htmlFor="edit-firstName">First Name *</Label>
            <Input
              id="edit-firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={errors.firstName ? 'user-edit-dialog__input--error' : ''}
            />
            {errors.firstName && (
              <span className="user-edit-dialog__error">{errors.firstName}</span>
            )}
          </div>

          <div className="user-edit-dialog__field">
            <Label htmlFor="edit-lastName">Last Name *</Label>
            <Input
              id="edit-lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={errors.lastName ? 'user-edit-dialog__input--error' : ''}
            />
            {errors.lastName && (
              <span className="user-edit-dialog__error">{errors.lastName}</span>
            )}
          </div>

          <div className="user-edit-dialog__field">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'user-edit-dialog__input--error' : ''}
            />
            {errors.email && (
              <span className="user-edit-dialog__error">{errors.email}</span>
            )}
          </div>

          <div className="user-edit-dialog__field">
            <Label htmlFor="edit-function">Job Function *</Label>
            <Input
              id="edit-function"
              type="text"
              value={formData.function}
              onChange={(e) => setFormData({ ...formData, function: e.target.value })}
              className={errors.function ? 'user-edit-dialog__input--error' : ''}
            />
            {errors.function && (
              <span className="user-edit-dialog__error">{errors.function}</span>
            )}
          </div>

          <div className="user-edit-dialog__field">
            <Label htmlFor="edit-role">Role *</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value: string) => setFormData({ ...formData, roleId: value })}
            >
              <SelectTrigger id="edit-role">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
