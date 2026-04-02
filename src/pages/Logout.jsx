import { useDispatch } from "react-redux";
import { postLogout } from "../store/auth";
import { clearUser } from "../store/user"; 
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(postLogout());

    if (postLogout.fulfilled.match(result)) {
      dispatch(clearUser());
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-gradient-to-r from-red-500 to-pink-500 px-2 py-3 rounded-xl text-white text-lg mb-4 hover:from-red-700 hover:to-pink-700"
    >
      Logout
    </button>
  );
}