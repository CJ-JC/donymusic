import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Vimeo from "@u-wave/react-vimeo";
import { BookOpen } from "lucide-react";

const CourseCard = ({ id, title, imageUrl, chaptersLength, price, slug }) => {
  // const [course, setCourse] = useState(null);

  // const [selectedVideo, setSelectedVideo] = useState(null);
  // const { id } = useParams();

  // useEffect(() => {
  //   axios
  //     .get(`/api/course/${id}`)
  //     .then((res) => {
  //       setCourse(res.data);
  //       // Définir la première vidéo comme vidéo sélectionnée par défaut
  //       if (res.data.chapters && res.data.chapters[0]?.videos?.length > 0) {
  //         setSelectedVideo(res.data.chapters[0].videos[0].url);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la récupération du cours", error);
  //     });
  // }, [id]);

  // if (!course) {
  //   return <div className="p-8 text-center">Chargement...</div>;
  // }

  return (
    <>
      <Link to={`/detail/slug/${slug}`} key={id}>
        <article className="pt-30 relative isolate mx-auto flex h-72 max-w-sm flex-col justify-end overflow-hidden rounded-2xl px-4 pb-4">
          <img
            alt={title}
            src={`http://localhost:8001${imageUrl}`}
            style={{
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80"></div>
          <h3 className="z-10 text-xl font-medium text-white">{title}</h3>
          <div className="z-10 my-2 flex space-x-2">
            <BookOpen className="mr-2 h-6 w-6 rounded-full bg-white p-0.5 text-green-700" />
            <span className="text-white">
              {chaptersLength.length > 1
                ? chaptersLength + " Chapitres"
                : chaptersLength + " Chapitre"}
            </span>
          </div>
          <span className="absolute bottom-5 right-0 mr-3 mt-3 rounded-full px-2 py-1 text-sm text-white">
            {price}€
          </span>
        </article>
      </Link>

      {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-[70%_30%]">

			<div className="overflow-hidden rounded-lg bg-gray-900">
			{selectedVideo ? (
				<Vimeo video={selectedVideo} responsive={true} autoplay={false} />
			) : (
				<div className="flex aspect-video items-center justify-center bg-gray-800 text-white">
				Sélectionnez une vidéo
				</div>
			)}
			</div>


			<div className="overflow-hidden rounded-lg bg-white shadow-lg">
			{course.chapters?.map((chapter) => (
				<div key={chapter.id} className="border-b last:border-b-0">
				<div className="bg-gray-50 p-4">
					<h3 className="text-lg font-semibold">{chapter.title}</h3>
					<p className="mt-1 text-sm text-gray-600">
					{chapter.description}
					</p>
				</div>

				<div className="divide-y">
					{chapter.videos?.map((video) => (
					<button
						key={video.id}
						onClick={() => setSelectedVideo(video.url)}
						className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
						selectedVideo === video.url ? "bg-blue-50" : ""
						}`}
					>
						<div className="flex items-center gap-3">
						<div className="flex-1">
							<h4 className="font-medium text-gray-900">
							Vidéo {video.id}
							</h4>
							<p className="truncate text-sm text-gray-500">
							{chapter.title}
							</p>
						</div>
						{selectedVideo === video.url && (
							<span className="text-blue-600">▶</span>
						)}
						</div>
					</button>
					))}
				</div>
				</div>
			))}
			</div>
		</div> */}
    </>
  );
};

export default CourseCard;
