import Link from 'next/link'

function Header() {
  return (
    <header className="mx-auto flex max-w-full justify-between border-b-2 border-black bg-yellow-500 p-5 ">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain" //object-contain keeps aspect ratio
            src="https://links.papareact.com/yvf"
            alt=""
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-500 py-1 px-4 text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className=" flex items-center space-x-5">
        <h3>Sign In</h3>
        <h3 className=" border-white-600 rounded-full border bg-black px-4 py-1 text-white">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
