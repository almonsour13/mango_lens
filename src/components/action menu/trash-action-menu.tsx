
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MoreVertical, RefreshCw, Trash2 } from "lucide-react";

interface ActionMenuProps {
    trashID: number;
    handleAction:(action:number, trashID:number) => void;
}
export function TrashActionMenu({ trashID, handleAction }: ActionMenuProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors" >
                    <MoreVertical size={16} className="text-white" />
                  </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => handleAction(1, trashID)}
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restore
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => handleAction(2, trashID)}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Permenantly
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}