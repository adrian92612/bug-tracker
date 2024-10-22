type UserPageProps = {
  params: {
    id: string;
  };
};

const UserPage = ({ params }: UserPageProps) => {
  console.log(params.id);
  return <div>UserPage</div>;
};

export default UserPage;
