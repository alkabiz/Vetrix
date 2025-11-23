import type React from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { VeterinarianFormValues } from "../VeterinarianForm.schema"
import { EMPLOYMENT_STATUS_OPTIONS } from "../VeterinarianForm.constants"

export const ProfessionalInfoSection: React.FC = () => {
    const { control } = useFormContext<VeterinarianFormValues>()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="yearsExperience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="employmentStatusId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employment Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={control}
                    name="education"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Education</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={2}
                                    placeholder="Educational background, degrees, institutions..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="specializationNotes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specialization Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={2}
                                    placeholder="Areas of specialization, special interests..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
