import { Image as img, Tree, Trash as TRS } from "@/types/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Check,
    ImageIcon,
    TreeDeciduous,
} from "lucide-react";
import { useCallback } from "react";
import { TrashActionMenu } from "../action menu/trash-action-menu";
import { formatDate } from "date-fns";

type TrashItem = TRS & { item: Tree | img };

export const TrashTable = ({
    trashes,
    isSelected,
    selected,
    setSelected,
    handleAction,
}: {
    trashes: TrashItem[];
    isSelected: boolean;
    selected: string[];
    setSelected: (value: string[]) => void;
    handleAction: (action: number, trashID: string) => void;
}) => {
    const handleCheck = useCallback(
        (trashID: string) => {
            if (isSelected) {
                setSelected(
                    selected.includes(trashID)
                        ? selected.filter((id: string) => id !== trashID)
                        : [...selected, trashID]
                );
            }
        },
        [isSelected, selected, setSelected]
    );

    const isItemSelected = useCallback(
        (pendingID: string) => selected.includes(pendingID),
        [selected]
    );

    return (
        <Table className="border-0">
            <TableHeader className="bg-transparent">
                <TableRow>
                    <TableHead className="table-cell"></TableHead>
                    <TableHead className="table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Tree Code
                    </TableHead>
                    <TableHead className="table-cell">Date Deleted</TableHead>
                    <TableHead className="table-cell"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trashes &&
                    trashes.length > 0 &&
                    trashes.map((trash, index) => {
                        return (
                            <TableRow
                                key={index}
                                onClick={() => handleCheck(trash.trashID)}
                                className={`${
                                    isItemSelected(trash.trashID)
                                        ? "bg-muted"
                                        : ""
                                }`}
                            >
                                <TableCell className="w-10">
                                    {isSelected ? (
                                        <div
                                            className={`h-4 w-4 flex items-center justify-center rounded border-primary border-2 ${
                                                isItemSelected(trash.trashID)
                                                    ? "bg-primary"
                                                    : ""
                                            }`}
                                            role="checkbox"
                                            aria-checked={isItemSelected(
                                                trash.trashID
                                            )}
                                            tabIndex={0}
                                        >
                                            {isItemSelected(trash.trashID) && (
                                                <Check
                                                    className="h-4 w-4 text-primary-foreground"
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </div>
                                    ) : trash.type == 1 ? (
                                        <div className="relative w-full h-full">
                                            <ImageIcon className="opacity-20" />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <TreeDeciduous className="opacity-20" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="table-cell">
                                    {trash.type == 1 ? "Tree" : "Image"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {trash.type == 1
                                        ? (trash.item as Tree).treeCode
                                        : "N / A"}
                                </TableCell>
                                <TableCell className="table-cell">
                                    {formatDate(
                                        trash.deletedAt,
                                        "MMM dd, yyyy"
                                    )}
                                </TableCell>
                                <TableCell className="flex gap-2 justify-end">
                                    <TrashActionMenu
                                        trashID={trash.trashID}
                                        handleAction={handleAction}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};
