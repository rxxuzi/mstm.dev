// src/app/content/layout.tsx
import { ContentToolbar } from "@/components/ContentToolbar"

export default function ContentLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <ContentToolbar />
        </>
    )
}