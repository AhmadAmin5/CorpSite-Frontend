import { useForm } from 'react-hook-form';
import { useSubmitContactQueryMutation } from '../contactApi';
import { Button, Input } from '../../../components';
import useToast from '../../../context/ToastContext';

const ContactForm = () => {
  const toast = useToast();
  const [submitContactQuery, { isLoading }] = useSubmitContactQueryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitContactQuery(data).unwrap();
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || 'Failed to send message. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
      </div>

      <Input
        label="Subject"
        placeholder="How can we help you?"
        error={errors.subject?.message}
        {...register('subject', { required: 'Subject is required' })}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-(--foreground) mb-1">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Tell us more about your project, needs, or inquiry..."
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
            bg-(--background) text-(--foreground) resize-y
            ${
              errors.message
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-(--border) focus:border-primary focus:ring-primary/20'
            }
          `}
          {...register('message', { required: 'Message is required' })}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          isButtonLoading={isLoading}
          text="Send Message"
          loadingText="Sending..."
          className="w-full sm:w-auto px-8"
        />
      </div>
    </form>
  );
};

export default ContactForm;
