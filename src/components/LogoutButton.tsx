"use client";

const LogoutButton = () => {
  const handleLogout = () => {
    document.cookie = "token=; max-age=0; path=/"; 

    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200 ease-in-out"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
