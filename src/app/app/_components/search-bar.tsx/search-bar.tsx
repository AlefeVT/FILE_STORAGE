"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLoader2 } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";

const formSchema = z.object({
    query: z.string().min(0).max(200),
});

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps ) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(values: any) {
        onSearch(values.query);
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} 
                                    placeholder="Pesquise..."/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" size={"sm"} disabled={form.formState.isSubmitting} className="flex gap-1">
                        {form.formState.isSubmitting && <LuLoader2 className="h-4 animate-spin" />}
                        <IoSearch /> Pesquisar
                    </Button>
                </form>
            </Form>
        </div>
    );
}
