
export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white p-4 fixed bottom-0 left-0 right-0 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} ShoeStore. All rights reservedd.</p>
          </div>
        </footer>
      );
    };