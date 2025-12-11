import { useState, useEffect } from 'react';
import { UsersRound, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { UserGroup } from '@/types';
import './GroupForm.css';

interface GroupFormProps {
  group?: UserGroup | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export function GroupForm({ group, mode, onSuccess }: GroupFormProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form in edit mode
  useEffect(() => {
    if (mode === 'edit' && group) {
      setFormData({
        name: group.name,
        description: group.description,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    }
  }, [mode, group]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === 'create') {
      const newGroup: UserGroup = {
        id: `group-${Date.now()}`,
        name: formData.name.trim(),
        description: formData.description.trim(),
        memberIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_GROUP', payload: newGroup });

      // Clear form
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    } else if (mode === 'edit' && group) {
      const updatedGroup: UserGroup = {
        ...group,
        name: formData.name.trim(),
        description: formData.description.trim(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE_GROUP', payload: updatedGroup });
    }

    onSuccess?.();
  };

  return (
    <Card className="group-form">
      <CardHeader>
        <CardTitle className="group-form__title">
          {mode === 'create' ? (
            <>
              <Plus size={20} strokeWidth={1.5} />
              Create New Group
            </>
          ) : (
            <>
              <UsersRound size={20} strokeWidth={1.5} />
              Edit Group
            </>
          )}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Create a new group to organize users with similar permissions'
            : 'Update group information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="group-form__form">
          <div className="group-form__field">
            <Label htmlFor="groupName">Group Name *</Label>
            <Input
              id="groupName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Project Alpha Team"
              className={errors.name ? 'group-form__input--error' : ''}
            />
            {errors.name && (
              <span className="group-form__error">{errors.name}</span>
            )}
          </div>

          <div className="group-form__field">
            <Label htmlFor="groupDescription">Description</Label>
            <textarea
              id="groupDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the group's purpose..."
              className="group-form__textarea"
              rows={3}
            />
          </div>

          <Button type="submit" className="group-form__submit">
            {mode === 'create' ? (
              <>
                <Plus size={16} strokeWidth={1.5} />
                Create Group
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={1.5} />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
