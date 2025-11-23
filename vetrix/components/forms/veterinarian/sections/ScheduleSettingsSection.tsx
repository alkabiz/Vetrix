import type React from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import type { VeterinarianFormValues } from "../VeterinarianForm.schema"

export const ScheduleSettingsSection: React.FC = () => {
    const { control } = useFormContext<VeterinarianFormValues>()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Schedule Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="maxDailyAppointments"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Daily Appointments</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="1" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="appointmentDurationDefault"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Default Appointment Duration (minutes)</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="15" step="15" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Active Veterinarian
                                </FormLabel>
                                <FormDescription>
                                    This veterinarian is currently active and can be scheduled.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
