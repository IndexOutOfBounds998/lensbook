// app/profile/[handle]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useProfile, usePublications, Profile, PublicationMainFocus } from "@lens-protocol/react-web";
import { formatPicture } from "../../utils/utils";

export default function Profile() {
  const { handle } = useParams();

  let { data: profile, loading } = useProfile({ handle });

  if (loading) return <p className="p-14">Loading ...</p>;

  return (
    <div>
      <div className="p-14">
        {profile?.picture?.__typename === "MediaSet" && (
          <img
            width="200"
            height="200"
            alt={profile.handle}
            className="rounded-xl"
            src={formatPicture(profile.picture)}
          />
        )}
        <h1 className="text-3xl my-3">{profile?.handle}</h1>
        <h3 className="text-xl mb-4">{profile?.bio}</h3>
        {profile && <Publications profile={profile} />}
      </div>
    </div>
  );
}

function Publications({ profile }: { profile: Profile }) {
  let { data: publications } = usePublications({
    profileId: profile.id,
    limit: 10,
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Image, PublicationMainFocus.Video]
    }

  });
  publications = publications?.map((publication) => {
    if (publication.__typename === "Mirror") {
      return publication.mirrorOf;
    } else {
      return publication;
    }
  });

  return (
    <>
      {publications?.map((pub: any, index: number) => (
        <div key={index} className="py-4 bg-zinc-900 rounded mb-3 px-4">
          <p>{pub.metadata.content}</p>
          {pub.metadata?.media[0]?.original &&
            ["image/jpeg", "image/png"].includes(
              pub.metadata?.media[0]?.original.mimeType
            ) && (
              <img
                width="400"
                height="400"
                alt={profile.handle}
                className="rounded-xl mt-6 mb-2"
                src={formatPicture(pub.metadata.media[0])}
              />
            )}
        </div>
      ))}
    </>
  );
}
