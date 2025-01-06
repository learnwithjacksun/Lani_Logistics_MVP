import { X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg";
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  size = "md" 
}: ModalProps) => {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-[400px]",
    md: "max-w-[560px]",
    lg: "max-w-[720px]"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 h-full w-full backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        
        className={`
          ${sizeClasses[size]}
          w-full bg-background border border-line rounded-2xl shadow-lg
          relative animate-in fade-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="p-4 border-b border-line flex items-center justify-between">
            {title && <h2 className="font-semibold text-main">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-background_2 rounded-full text-sub hover:text-main"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal; 