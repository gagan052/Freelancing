function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} AbilityWorks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 