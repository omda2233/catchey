import { useState } from 'react';
import { useUser } from '@/contexts/userContext';
import { User } from '@/models/user';
import { ProfileForm } from './ProfileForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phoneNumber}</p>
          </div>
        </div>

        {user.role === 'seller' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            <div className="space-y-2">
              {user.businessName && <p>Business Name: {user.businessName}</p>}
              {user.businessAddress && <p>Business Address: {user.businessAddress}</p>}
              {user.location && <p>Location: {user.location}</p>}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {isEditing ? (
            <ProfileForm />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number</span>
                <span>{user.phoneNumber}</span>
              </div>
              {user.role === 'seller' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name</span>
                    <span>{user.businessName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span>{user.location || 'Not set'}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
