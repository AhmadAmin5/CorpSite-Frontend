import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux'; // [!code ++]
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Save,
  Shield,
  AtSign,
  FileText,
} from 'lucide-react';

// Import BOTH from authApi
import {
  useMeQuery,
  useUpdateProfileMutation,
} from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice'; // [!code ++]

import {
  Button,
  Input,
  Select,
  Spinner,
  StatusBadge,
  Img,
  PageHeader,
} from '../../components';
import useToast from '../../context/ToastContext';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const Profile = () => {
  const toast = useToast();
  const dispatch = useDispatch(); // [!code ++]
  const fileInputRef = useRef(null);
  const { data: meData, isLoading: isLoadingMe } = useMeQuery();
  const currentUser = meData?.data;

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (currentUser) {
      const formattedDob = currentUser.dateOfBirth
        ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
        : '';

      reset({
        fullName: currentUser.fullName || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || '',
        dateOfBirth: formattedDob,
        bio: currentUser.bio || '',
      });

      setPreviewUrl(currentUser.profilePicture || null);
    }
  }, [currentUser, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const updatedProfile = await updateProfile(formData).unwrap();

      dispatch(setCredentials({ user: updatedProfile.data }));

      toast.success('Profile updated successfully');
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoadingMe) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account settings."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        {/* --- LEFT COLUMN: Identity Card --- */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-(--background) shadow-md ring-1 ring-(--border)">
                {previewUrl ? (
                  <Img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-(--secondary)/10 flex items-center justify-center text-(--secondary)">
                    <User className="w-12 h-12 opacity-50" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg border-2 border-(--card) transition-transform hover:scale-105 active:scale-95"
                title="Change Profile Picture"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
              />
            </div>

            <h2 className="text-xl font-bold text-(--foreground)">
              {currentUser?.fullName}
            </h2>
            <p className="text-(--secondary) text-sm mb-2">
              @{currentUser?.username}
            </p>

            {currentUser?.bio && (
              <p className="text-sm text-(--foreground) opacity-80 mb-4 px-2 italic line-clamp-3">
                "{currentUser.bio}"
              </p>
            )}

            <div className="w-full pt-4 border-t border-(--border) flex justify-between items-center text-sm">
              <span className="text-(--secondary)">Role</span>
              <StatusBadge
                variant="info"
                icon={Shield}
                className="uppercase text-[10px]"
              >
                {currentUser?.role}
              </StatusBadge>
            </div>
            <div className="w-full pt-2 flex justify-between items-center text-sm">
              <span className="text-(--secondary)">Joined</span>
              <span className="font-medium text-(--foreground)">
                {new Date(currentUser?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Details Form --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm">
            <div className="px-6 py-4 border-b border-(--border)">
              <h3 className="font-semibold text-(--foreground)">
                Personal Information
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="e.g. John Doe"
                  error={errors.fullName?.message}
                  {...register('fullName', {
                    required: 'Full Name is required',
                  })}
                />

                <Input
                  label="Username"
                  icon={AtSign}
                  placeholder="e.g. johndoe"
                  error={errors.username?.message}
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />

                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="john@example.com"
                  disabled={true}
                  className="opacity-70"
                  error={errors.email?.message}
                  {...register('email', { required: 'Email is required' })}
                />

                <Input
                  label="Phone Number"
                  icon={Phone}
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  icon={Calendar}
                  {...register('dateOfBirth')}
                />

                <div className="space-y-1">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Gender"
                        options={GENDER_OPTIONS}
                        placeholder="Select Gender"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="block text-sm font-medium text-(--foreground) mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-(--secondary)">
                      <FileText className="w-5 h-5" />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Tell us a little about yourself..."
                      className="w-full pl-10 pr-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-(--background) text-(--foreground) transition-colors resize-none"
                      {...register('bio')}
                    />
                  </div>
                  <p className="text-xs text-(--secondary)">
                    Brief description for your profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-(--secondary)/5 border-t border-(--border) flex items-center justify-between">
              <span className="text-xs text-(--secondary)">
                {isDirty ? 'You have unsaved changes' : 'All changes saved'}
              </span>
              <Button
                type="submit"
                disabled={isLoadingMe || (!isDirty && !selectedFile)}
                isButtonLoading={isUpdating}
                icon={<Save />}
                text="Save Changes"
                loadingText="Saving Changes..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
