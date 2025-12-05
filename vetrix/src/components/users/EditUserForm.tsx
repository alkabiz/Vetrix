"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { UserDTO, UserUpdateInput } from "@/lib/api/types/user.types"

// Validation schema for edit form
const editUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    roleId: z.string().min(1, "Please select a role"),
    statusId: z.string().min(1, "Please select a status"),
})

type EditUserFormValues = z.infer<typeof editUserSchema>

interface EditUserFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserDTO | null
    onSubmit: (userId: number, data: UserUpdateInput) => Promise<void>
    isSubmitting?: boolean
}

/**
 * EditUserForm - Form component for editing user details
 * Pre-fills with existing user data and validates changes
 */
export function EditUserForm({ open, onOpenChange, user, onSubmit, isSubmitting = false }: EditUserFormProps) {
    const [error, setError] = useState("")

    const form = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            username: "",
            email: "",
            roleId: "",
            statusId: "",
        },
    })

    // Pre-fill form when user changes
    useEffect(() => {
        if (user && open) {
            form.reset({
                username: user.username,
                email: user.email,
                roleId: user.roleId.toString(),
                statusId: user.statusId.toString(),
            })
            setError("")
        }
    }, [user, open, form])

    const handleSubmit = async (values: EditUserFormValues) => {
        if (!user) return

        setError("")

        try {
            const updateData: UserUpdateInput = {
                username: values.username,
                email: values.email,
                roleId: parseInt(values.roleId),
                statusId: parseInt(values.statusId),
            }

            await onSubmit(user.id, updateData)
            onOpenChange(false)
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update user")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user details. Changes will be saved immediately.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role Field */}
                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Admin</SelectItem>
                                            <SelectItem value="2">Veterinarian</SelectItem>
                                            <SelectItem value="3">Assistant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Field */}
                        <FormField
                            control={form.control}
                            name="statusId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="2">Inactive</SelectItem>
                                            <SelectItem value="3">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role Change Warning */}
                        {user && user.roleId === 1 && form.watch("roleId") !== "1" && (
                            <Alert>
                                <AlertDescription>
                                    ⚠️ Warning: Changing this admin user's role may affect system access.
                                    Ensure there is at least one other admin user.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update User"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
