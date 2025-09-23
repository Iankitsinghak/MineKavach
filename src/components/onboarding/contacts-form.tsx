// src/components/onboarding/contacts-form.tsx
'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowLeft, Trash2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
});

const formSchema = z.object({
  contacts: z.array(contactSchema).nonempty("Please add at least one contact."),
});

type FormValues = z.infer<typeof formSchema>;


interface ContactsFormProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function ContactsForm({ onSubmit, onBack }: ContactsFormProps) {
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contacts: [{ name: '', email: '', phone: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'contacts',
    });

    const handleFinish = (data: FormValues) => {
      onSubmit({ contacts: data.contacts });
      router.push('/dashboard');
    }

    return (
        <>
            <CardHeader className="p-0 pb-6">
                <CardTitle>Step 4: Emergency Contacts</CardTitle>
                <CardDescription>Add the personnel who should receive critical alerts.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFinish)} className="space-y-6">
                    <div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-7 gap-4 mb-4 items-start p-4 border rounded-lg relative">
                                <FormField
                                    control={form.control}
                                    name={`contacts.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`contacts.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="j.doe@mine.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`contacts.${index}.phone`}
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1234567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="sm:col-span-1 flex items-end h-full">
                                     <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="mt-auto"
                                        disabled={fields.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                         {form.formState.errors.contacts && form.formState.errors.contacts.message && (
                            <p className="text-sm font-medium text-destructive">{form.formState.errors.contacts.message}</p>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: '', email: '', phone: '' })}
                        className="w-full"
                    >
                        <PlusCircle className="mr-2" />
                        Add Another Contact
                    </Button>

                    <div className="flex justify-between mt-8">
                        <Button onClick={onBack} variant="outline" type="button">
                            <ArrowLeft className="mr-2"/>
                            Back
                        </Button>
                        <Button type="submit">
                            Finish Setup
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}