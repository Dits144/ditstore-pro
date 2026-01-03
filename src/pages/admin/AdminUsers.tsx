import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, User, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  user_roles: {
    role: string;
  }[];
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      return;
    }

    // Fetch roles separately
    const { data: rolesData } = await supabase.from('user_roles').select('user_id, role');
    
    const usersWithRoles = (profilesData || []).map(profile => ({
      ...profile,
      user_roles: (rolesData || []).filter(r => r.user_id === profile.id).map(r => ({ role: r.role }))
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isAdmin = (user: UserProfile) => {
    return user.user_roles?.some(r => r.role === 'admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Manajemen Pengguna</h1>
        <p className="text-muted-foreground">Daftar semua pengguna terdaftar</p>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold">Pengguna</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Role</th>
                <th className="text-left p-4 font-semibold">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Tidak ada pengguna ditemukan
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin(user) ? 'gradient-primary' : 'bg-muted'}`}>
                          {isAdmin(user) ? (
                            <Shield className="w-5 h-5 text-primary-foreground" />
                          ) : (
                            <User className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{user.full_name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.email || '-'}</td>
                    <td className="p-4">
                      {isAdmin(user) ? (
                        <Badge className="gradient-primary border-0">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(user.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
