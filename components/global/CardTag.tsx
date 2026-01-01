import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const CardTag = ({
    title,
    description,
    content,
    footer,
} : {
    title: string,
    description: string,
    content: React.ReactNode,
    footer: React.ReactNode
}) => {
  return (
    <Card className="w-full max-w-md shadow-lg flex flex-col  bg-white dark:bg-slate-800">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter>{footer}</CardFooter>
    </Card>
  )
}

export default CardTag
