import Brand from "../components/Common/Brand";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-8">
      <div className="animate-pulse">
        <Brand />
      </div>
      
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary_1 animate-ping" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-primary_1 animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-primary_1 animate-ping" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default Loading;