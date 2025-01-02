
const Brand = () => {
  return (
    <>
      <div className="flex items-center flex-col gap-1">
        <div className='center'>
          <img
            src="/logo-orange.png"
            alt="Lani Logistics"
            className=" object-cover"
            width={50}
          />
        </div>
        <h1 className="text-2xl text-main font-bold">
          Lani Logistics
        </h1>
      </div>
    </>
  );
};

export default Brand;
