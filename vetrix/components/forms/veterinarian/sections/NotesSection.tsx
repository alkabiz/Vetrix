import type React from "react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { VeterinarianFormValues } from "../VeterinarianForm.schema"

export const NotesSection: React.FC = () => {
    const { control } = useFormContext<VeterinarianFormValues>()

    return (
        <div className="space-y-2">
            <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                rows={3}
                                placeholder="Any additional notes about the veterinarian..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
