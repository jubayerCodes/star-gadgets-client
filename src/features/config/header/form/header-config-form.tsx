"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateHeaderConfigPayload, updateHeaderConfigValidation } from "../schema";
import { UpdateHeaderConfigFormData } from "../schema";
import { useFieldArray, useForm } from "react-hook-form";
import AddNavLinkModal from "../modals/add-navLink-modal";
import { useUpdateHeaderConfig } from "../../hooks/useHeaderConfig";
import { useGetConfig } from "../../hooks/useConfig";
import { GripVertical, X } from "lucide-react";
import { useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DashboardConfigHeader from "@/components/dashboard/dashbaord-config-header";

export function HeaderConfigForm() {
  const { data: config } = useGetConfig();

  const form = useForm<UpdateHeaderConfigFormData>({
    resolver: zodResolver(updateHeaderConfigValidation),
    defaultValues: {
      header: {
        navLinks: [],
      },
    },
  });

  useEffect(() => {
    if (config?.data?.header?.navLinks) {
      form.reset({ header: { navLinks: config.data.header.navLinks } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const {
    fields,
    move: moveField,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "header.navLinks",
  });

  const { mutateAsync: updateHeaderConfig, isPending } = useUpdateHeaderConfig();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      moveField(oldIndex, newIndex);
    }
  };

  const handleSubmit = (data: UpdateHeaderConfigFormData) => {
    const payload: UpdateHeaderConfigPayload = {
      header: {
        navLinks: data.header.navLinks.map((link) => link._id),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    updateHeaderConfig({ id: config?.data._id!, data: payload });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <DashboardConfigHeader
          title="Header Configurations"
          description="Manage your header configurations"
          isPending={isPending}
          form={form}
        />
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Nav Links</h3>
            <AddNavLinkModal form={form} />
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f) => f.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {fields.map((field) => (
                  <SortableNavLink
                    key={field.id}
                    id={field.id}
                    title={field.title}
                    onRemove={() => remove(fields.findIndex((f) => f.id === field.id))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </form>
    </div>
  );
}

function SortableNavLink({ id, title, onRemove }: { id: string; title: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-sm shadow-sm transition-opacity ${
        isDragging ? "opacity-60" : "opacity-100"
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <span>{title}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md p-0.5 cursor-pointer"
        aria-label="Remove nav link"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
