import CourseCard from "./course-card";

const courseList = ({ courses }) => {
  return (
    <>
      <div className="my-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            imageUrl={course.imageUrl}
            chaptersLength={course.chapters.length}
            price={course.price}
            videoUrl={course.videoUrl}
            slug={course.slug}
            discountedPrice={course.discountedPrice}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-muted-foreground mt-10 text-center text-sm">
          Aucune formation trouvée
        </p>
      )}
    </>
  );
};

export default courseList;
