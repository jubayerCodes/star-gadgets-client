import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import { Suspense } from "react";
import UploadImageModal from "@/features/gallery/components/upload-image-modal";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";

const GalleryPage = () => {
  return (
    <div>
      <DashboardHeader title="Gallery" description="Manage your uploaded images">
        <UploadImageModal />
      </DashboardHeader>
      <Suspense fallback={<Loading />}>
        <GalleryGrid />
      </Suspense>
    </div>
  );
};

export default GalleryPage;
