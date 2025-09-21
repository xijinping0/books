export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xs w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 select-none">404</h1>
          <div className="h-px bg-gray-300 mx-auto w-24 mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">页面未找到</h2>
          <p className="text-gray-600 mb-8">您要查找的页面不存在或已被移动</p>
        </div>

        <div>
          <a
            href="/"
            className="inline-block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
