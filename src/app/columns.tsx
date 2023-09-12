"use client"

import { ColumnDef } from "@tanstack/react-table"
import { FSAMapping } from './interfaces'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<FSAMapping>[] = [
  {
    accessorKey: "fsa",
    header: () => <div className='text-left text-teal-600'>Postal Code FSA</div>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
        return (
            <Button
                variant={'ghost'}
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className='text-teal-600 float-left'
            >
                City
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({row}) => <div className="font-medium">{row.getValue("city")}</div>
  },
  {
    accessorKey: "cumulativeRevenue",
    header: () => <div className='text-right text-teal-600'>Cumulative Revenue</div>,
    cell: ({row}) => {
        const amount = parseFloat(row.getValue("cumulativeRevenue"))
        const formatted = new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD"
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "cumulativeJobs",
    header: () => <div className='text-teal-600'>Cumulative Jobs</div>,
  },
  {
    accessorKey: "averageRevenuePerJob",
    header: () => <div className='text-right text-teal-600'>Average Revenue Per Job</div>,
    cell: ({row}) => {
        const amount = parseFloat(row.getValue("averageRevenuePerJob"))
        const formatted = new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD"
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
    }
  },
]
