import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import ModalDrawer from "./modal-drawer-wrapper"
import ConfirmationModal from "./confirmation-modal"
import { Disease } from "@/type/types"

const formSchema = z.object({
    diseaseName: z.string().min(2, { message: "Disease name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    severityLevel: z.enum(["Mild", "Moderate", "Severe"], {
        required_error: "Please select a severity level.",
    }),
});

interface DiseaseModalProps {
    openDialog: boolean
    setOpenDialog: (value: boolean) => void
    editingDisease: Disease | null
    setEditingDisease: (value: Disease | null) => void
    fetchDiseases: () => void
}

export default function DiseaseModal({ openDialog, setOpenDialog, editingDisease, setEditingDisease, fetchDiseases }: DiseaseModalProps) {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diseaseName: "",
            description: "",
            severityLevel: undefined,
        },
    })

    useEffect(() => {
        if (editingDisease) {
            form.reset({
                diseaseName: editingDisease.diseaseName,
                description: editingDisease.description,
            })
        } else {
            form.reset({
                diseaseName: "",
                description: "",
                severityLevel: undefined,
            })
        }
    }, [editingDisease, form])
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const method = editingDisease ? 'PUT' : 'POST';
        const payload = editingDisease 
            ? { diseaseID: editingDisease.diseaseID, ...values } 
            : values;
            
        try {
            const response = await fetch('/api/diseases', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                toast({
                    title: `Disease ${editingDisease ? 'updated' : 'added'} successfully.`,
                    variant: "default",
                })
                setOpenDialog(false);
                setEditingDisease(null);
                fetchDiseases();
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.error,
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        }
    };
    const handleDelete = async (diseaseID:number) => {
        setConfirmationModalOpen(true)
    }
    const handleConfirmDelete = async () => {
        try {
            const response = await fetch('/api/diseases', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ diseaseID:editingDisease?.diseaseID }),
            });
      
            const result = await response.json();
      
            if (result.success) {
              toast({
                title: `Delete Disease`,
                description: `Delete action performed on disease ${editingDisease?.diseaseID}`,
              })
              fetchDiseases()
              setOpenDialog(false)
              setEditingDisease(null)
              form.reset()
            }
          } catch (error) {
            console.error('Error deleting disease:', error);
          };
        setConfirmationModalOpen(false);
    };
    const handleCancel = () => {
        setOpenDialog(false)
        setEditingDisease(null)
        form.reset()
    }
    
    return (
            <ModalDrawer open={openDialog} onOpenChange={setOpenDialog}>
                <DialogHeader>
                    <DialogTitle>{editingDisease ? 'Edit Disease' : 'Add New Disease'}</DialogTitle>
                    <DialogDescription>
                        {editingDisease ? 'Update the details of the disease here.' : 'Enter the details of the disease here.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="diseaseName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className='resize-none' placeholder="Enter Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <div className="flex justify-end gap-4">
                                {editingDisease && 
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleDelete(editingDisease.diseaseID)}
                                        className="text-destructive"
                                    >
                                        Delete
                                    </Button>
                                }
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
                <ConfirmationModal
                    open={confirmationModalOpen}
                    onClose={setConfirmationModalOpen}
                    onConfirm={handleConfirmDelete}
                    title="Are you sure?"
                    content="This action cannot be undone."
                />
            </ModalDrawer>
    )
}
