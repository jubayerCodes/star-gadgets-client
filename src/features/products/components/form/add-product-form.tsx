"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import DashboardButton from "@/components/dashboard/dashboard-button";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import DashboardSelectField from "@/components/form/dashboard/dashboard-select-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import InfinityComboboxField from "@/components/form/Shared/infinity-combobox-field";

import { CreateProductFormData, createProductZodSchema } from "../../schemas/product.schema";
import { useCreateProductMutation } from "../../hooks/useProducts";
import { useSlug } from "@/hooks/use-slug";
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";
import { useBrandsListInfinityQuery } from "@/features/brands/hooks/useBrands";
import { useSubCategoriesListInfinityQuery } from "@/features/sub-categories/hooks/useSubCategory";
import CreateCategoryModal from "@/features/categories/components/modals/create-category-modal";
import CreateBrandModal from "@/features/brands/components/models/createBrandModal";
import CreateSubCategoryModal from "@/features/sub-categories/components/modal/create-sub-category-modal";
import { GalleryImagePicker } from "@/components/shared/GalleryImagePicker";
import { ProductStatus } from "../../types/product.types";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import SubCategoryComboboxField from "@/features/sub-categories/components/form/SubCategoryComboboxField";

export const AddProductForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { mutateAsync: createProduct, isPending } = useCreateProductMutation();

  const defaultValues: CreateProductFormData = {
    title: "",
    slug: "",
    featuredImage: "",
    subCategoryId: "",
    brandId: "",
    categoryId: "",
    productCode: "",
    keyFeatures: "",
    description: "",
    isActive: true,
    isDeleted: false,
    specifications: [
      {
        heading: "",
        specifications: [{ name: "", value: "" }],
      },
    ],
    attributes: [{ name: "", values: [""] }],
    variants: [
      {
        attributes: [{ name: "", value: "" }],
        price: 0,
        regularPrice: 0,
        stock: 0,
        status: ProductStatus.IN_STOCK,
        sku: "",
        images: [],
        featuredImage: "",
        featured: false,
        isActive: true,
      },
    ],
  };

  const form = useForm<CreateProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createProductZodSchema) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
    mode: "onChange",
  });

  useSlug({ form, sourceName: "title", targetName: "slug" });

  // Watch categoryId so SubCategoryComboboxField re-queries when it changes
  const selectedCategoryId = useWatch({ control: form.control, name: "categoryId" });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const steps = [
    {
      id: "Step 1",
      name: "General Info",
      fields: ["title", "slug", "productCode", "isActive", "categoryId", "subCategoryId", "brandId"],
    },
    {
      id: "Step 2",
      name: "Details & Media",
      fields: ["featuredImage", "keyFeatures", "description"],
    },
    {
      id: "Step 3",
      name: "Attributes",
      fields: ["attributes"],
    },
    {
      id: "Step 4",
      name: "Variants",
      fields: ["variants"],
    },
    {
      id: "Step 5",
      name: "Specifications",
      fields: ["specifications"],
    },
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (data: CreateProductFormData) => {
    console.log(data);
    const result = await createProduct(data);
    if (result.success) {
      form.reset();
      setCurrentStep(0);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Progress Indicator */}
      <div className="relative mb-8 pt-4">
        <div className="relative z-10 flex w-full items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center gap-2 bg-background px-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium transition-colors ${
                  currentStep > index
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === index
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                }`}
              >
                {currentStep > index ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${currentStep >= index ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step.name}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute left-0 top-[20px] -z-10 h-[2px] w-full bg-muted-foreground/30">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* STEP 1: General Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DashboardInputField
                  form={form}
                  name="title"
                  label="Product Title"
                  placeholder="Enter product title"
                  required
                />
                <DashboardInputField form={form} name="slug" label="Slug" placeholder="Enter slug" required />
                <DashboardInputField
                  form={form}
                  name="productCode"
                  label="Product Code"
                  placeholder="Enter product code"
                  required
                />
                <div className="flex items-center gap-4 pt-8 md:col-span-3">
                  <CheckboxField form={form} name="isActive" label="Is Active?" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium">Relationships</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Category */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InfinityComboboxField
                      form={form}
                      name="categoryId"
                      label="Category"
                      placeholder="Select category"
                      infinityFunction={useCategoriesListInfinityQuery}
                      required
                    />
                  </div>
                  <CreateCategoryModal>
                    <DashboardButton className={"h-9"}>Add</DashboardButton>
                  </CreateCategoryModal>
                </div>

                {/* Sub-Category — filtered by selected category */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <SubCategoryComboboxField
                      form={form}
                      name="subCategoryId"
                      label="Sub-Category"
                      placeholder="Select sub-category"
                      categoryId={selectedCategoryId}
                      infinityFunction={useSubCategoriesListInfinityQuery}
                      required
                    />
                  </div>
                  <CreateSubCategoryModal>
                    <DashboardButton className={"h-9"}>Add</DashboardButton>
                  </CreateSubCategoryModal>
                </div>

                {/* Brand */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InfinityComboboxField
                      form={form}
                      name="brandId"
                      label="Brand"
                      placeholder="Select brand"
                      infinityFunction={useBrandsListInfinityQuery}
                      required
                    />
                  </div>
                  <CreateBrandModal>
                    <DashboardButton className={"h-9"}>Add</DashboardButton>
                  </CreateBrandModal>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Details & Media */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium">Featured Media</h3>
              <div className="mb-6 flex flex-col gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Featured Image <span className="text-destructive">*</span>
                </label>
                <Controller
                  control={form.control}
                  name="featuredImage"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                      <GalleryImagePicker value={field.value} onChange={field.onChange} required className="h-120!" />
                      {fieldState.error && (
                        <p className="text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium">Product Details</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Key Features <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    control={form.control}
                    name="keyFeatures"
                    render={({ field, fieldState }) => (
                      <div>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter key features..."
                          error={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="mt-1 text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <div>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter description..."
                          error={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <p className="mt-1 text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Attributes */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Attributes</h3>
                <DashboardButton
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={(() => {
                    const lastAttr = form.watch(`attributes.${attributeFields.length - 1}`);
                    return !lastAttr?.name?.trim();
                  })()}
                  onClick={() => appendAttribute({ name: "", values: [""] })}
                >
                  <Plus className="h-4 w-4" /> Add Attribute
                </DashboardButton>
              </div>

              <div className="space-y-4">
                {attributeFields.map((field, index) => (
                  <div key={field.id} className="relative rounded-md border p-4">
                    <DashboardButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 text-destructive hover:bg-destructive/10 hover:text-destructive size-7"
                      onClick={() => {
                        if (attributeFields.length === 1) {
                          removeAttribute(index);
                          appendAttribute({ name: "", values: [""] });
                        } else {
                          removeAttribute(index);
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </DashboardButton>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:mt-0 md:grid-cols-2">
                      <DashboardInputField
                        form={form}
                        name={`attributes.${index}.name`}
                        label="Attribute Name"
                        placeholder="e.g. Color, Size"
                        required
                      />

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-none">Attribute Values (Comma separated)</label>
                        <Controller
                          control={form.control}
                          name={`attributes.${index}.values`}
                          render={({ field }) => (
                            <div className="flex flex-col gap-1">
                              <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. Red, Blue, Green"
                                value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                                onChange={(e) => {
                                  const vals = e.target.value
                                    .split(",")
                                    .map((v) => v.trim())
                                    .filter((v) => v !== "");
                                  field.onChange(vals.length > 0 ? vals : [""]);
                                }}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {form.formState.errors.attributes?.root && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {form.formState.errors.attributes.root.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Variants */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Variants</h3>
                <DashboardButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendVariant({
                      attributes: [{ name: "", value: "" }],
                      price: 0,
                      regularPrice: 0,
                      stock: 0,
                      status: ProductStatus.IN_STOCK,
                      sku: "",
                      images: [""],
                      featuredImage: "",
                      featured: false,
                      isActive: true,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Variant
                </DashboardButton>
              </div>

              <div className="space-y-6">
                {variantFields.map((field, index) => (
                  <div key={field.id} className="relative rounded-md border bg-muted/20 p-4">
                    <div className="mb-4 flex items-center justify-between border-b pb-2">
                      <h4 className="text-sm font-medium">Variant #{index + 1}</h4>
                      <DashboardButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DashboardButton>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <DashboardInputField form={form} name={`variants.${index}.sku` as const} label="SKU" required />
                      <DashboardInputField
                        form={form}
                        name={`variants.${index}.regularPrice` as const}
                        label="Regular Price"
                        required
                      />
                      <DashboardInputField
                        form={form}
                        name={`variants.${index}.price` as const}
                        label="Sale Price (Optional)"
                      />
                      <DashboardInputField
                        form={form}
                        name={`variants.${index}.stock` as const}
                        label="Stock"
                        required
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <DashboardSelectField
                        form={form}
                        name={`variants.${index}.status`}
                        label="Status"
                        options={Object.values(ProductStatus).map((s) => ({ label: s, value: s }))}
                        required
                      />
                      <div className="flex items-center gap-4 pt-8">
                        <CheckboxField form={form} name={`variants.${index}.featured`} label="Featured" />
                        <CheckboxField form={form} name={`variants.${index}.isActive`} label="Active" />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-none">Variant Attributes Configuration</label>
                        <Controller
                          control={form.control}
                          name={`variants.${index}.attributes`}
                          render={({ field: attrField }) => (
                            <div className="flex flex-col gap-2 rounded-md border p-3">
                              {attrField.value.map((attr, attrIdx) => (
                                <div key={attrIdx} className="flex items-center gap-2">
                                  <input
                                    className="flex h-9 w-1/2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                    placeholder="Name (e.g. Color)"
                                    value={attr.name}
                                    onChange={(e) => {
                                      const newAttrs = [...attrField.value];
                                      newAttrs[attrIdx].name = e.target.value;
                                      attrField.onChange(newAttrs);
                                    }}
                                  />
                                  <input
                                    className="flex h-9 w-1/2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                    placeholder="Value (e.g. Red)"
                                    value={attr.value}
                                    onChange={(e) => {
                                      const newAttrs = [...attrField.value];
                                      newAttrs[attrIdx].value = e.target.value;
                                      attrField.onChange(newAttrs);
                                    }}
                                  />
                                  <DashboardButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                      const newAttrs = attrField.value.filter((_, i) => i !== attrIdx);
                                      attrField.onChange(newAttrs.length > 0 ? newAttrs : [{ name: "", value: "" }]);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </DashboardButton>
                                </div>
                              ))}
                              <DashboardButton
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full text-xs"
                                onClick={() => attrField.onChange([...attrField.value, { name: "", value: "" }])}
                              >
                                Add Variant Attribute Option
                              </DashboardButton>
                            </div>
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Featured Image *
                        </label>
                        <Controller
                          control={form.control}
                          name={`variants.${index}.featuredImage`}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1">
                              <GalleryImagePicker value={field.value} onChange={field.onChange} required />
                              {fieldState.error && (
                                <p className="text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
                              )}
                            </div>
                          )}
                        />

                        <label className="mt-2 text-sm font-medium leading-none">
                          Gallery Images (Comma separated URLs for now) *
                        </label>
                        <Controller
                          control={form.control}
                          name={`variants.${index}.images`}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1">
                              <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="https://img1.com, https://img2.com"
                                value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                                onChange={(e) => {
                                  const vals = e.target.value
                                    .split(",")
                                    .map((v) => v.trim())
                                    .filter((v) => v !== "");
                                  field.onChange(vals.length > 0 ? vals : [""]);
                                }}
                              />
                              {fieldState.error && (
                                <p className="text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Specifications */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Specifications</h3>
                <DashboardButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendSpecification({
                      heading: "",
                      specifications: [{ name: "", value: "" }],
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Specification Group
                </DashboardButton>
              </div>

              <div className="space-y-6">
                {specificationFields.map((field, index) => (
                  <div key={field.id} className="relative rounded-md border p-4">
                    <DashboardButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 text-destructive hover:text-destructive"
                      onClick={() => removeSpecification(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </DashboardButton>

                    <div className="mb-4 pr-10">
                      <DashboardInputField
                        form={form}
                        name={`specifications.${index}.heading`}
                        label="Specification Group Heading"
                        placeholder="e.g. Display, Processor, Memory"
                        required
                      />
                    </div>

                    <Controller
                      control={form.control}
                      name={`specifications.${index}.specifications`}
                      render={({ field: subField }) => (
                        <div className="flex flex-col gap-3 rounded-md bg-muted/30 p-4">
                          <label className="text-sm font-medium">Items</label>
                          {subField.value.map((spec, specIdx) => (
                            <div key={specIdx} className="flex items-start gap-3">
                              <div className="flex-1">
                                <input
                                  className="mb-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors"
                                  placeholder="Name (e.g. Resolution)"
                                  value={spec.name}
                                  onChange={(e) => {
                                    const newSpecs = [...subField.value];
                                    newSpecs[specIdx].name = e.target.value;
                                    subField.onChange(newSpecs);
                                  }}
                                />
                              </div>
                              <div className="flex-[2]">
                                <input
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors"
                                  placeholder="Value (e.g. 1920x1080px)"
                                  value={spec.value}
                                  onChange={(e) => {
                                    const newSpecs = [...subField.value];
                                    newSpecs[specIdx].value = e.target.value;
                                    subField.onChange(newSpecs);
                                  }}
                                />
                              </div>
                              <DashboardButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-0 h-10 w-10 text-destructive"
                                onClick={() => {
                                  const newSpecs = subField.value.filter((_, i) => i !== specIdx);
                                  subField.onChange(newSpecs.length > 0 ? newSpecs : [{ name: "", value: "" }]);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </DashboardButton>
                            </div>
                          ))}
                          <DashboardButton
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 self-start text-xs"
                            onClick={() => subField.onChange([...subField.value, { name: "", value: "" }])}
                          >
                            <Plus className="mr-2 h-3 w-3" /> Add Item
                          </DashboardButton>
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pb-12 pt-4">
          <DashboardButton
            type="button"
            variant="outline"
            size="lg"
            onClick={prev}
            disabled={currentStep === 0}
            className={currentStep === 0 ? "invisible" : ""}
          >
            Previous
          </DashboardButton>

          {currentStep < steps.length - 1 ? (
            <DashboardButton type="button" size="lg" onClick={next}>
              Next Step
            </DashboardButton>
          ) : (
            <DashboardButton type="submit" size="lg" isLoading={isPending}>
              Create Product
            </DashboardButton>
          )}
        </div>
      </form>
    </div>
  );
};
