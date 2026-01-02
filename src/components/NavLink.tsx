import { useNavigate, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, children, className, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }

    const [path, hash] = to.split('#');
    
    // If it's a different page, navigate
    if (path && location.pathname !== path) {
      navigate(to);
      return;
    }

    // If it's a hash link on the same page, scroll to it
    if (hash) {
      // If we are not on the home page, navigate to home first, then scroll
      if (location.pathname !== '/') {
        navigate(`/#${hash}`);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // It's a normal link on the same page
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleNav} className={className}>
      {children}
    </a>
  );
};