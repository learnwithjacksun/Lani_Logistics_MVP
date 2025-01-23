import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ThemeToggle from "../Common/ThemeToggle"

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="layout py-4 flex justify-between items-center">
      <button 
        onClick={() => navigate(-1)}
        className="p-3 hover:bg-background_2 bg-background rounded-full"
      >
        <ArrowLeft size={20} className="text-main" />
      </button>
      <ThemeToggle />
    </header>
  )
}

export default Header