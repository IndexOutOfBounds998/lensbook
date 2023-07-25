// app/profile/[handle]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useProfile, usePublications, Profile, PublicationMainFocus, useActiveProfile } from "@lens-protocol/react-web";
import { formatPicture } from "../../utils/utils";
import { NextSeo } from "next-seo";
export default function Profile() {
  const { handle } = useParams();

  let { data: profile, loading } = useProfile({ handle });
  const { data: currentProfile } = useActiveProfile();
  if (loading) return <p className="p-14">Loading ...</p>;

  return (
    <>
      <NextSeo
        title={profile.bio}
        description={profile.bio}
        canonical={profile.handle}
        openGraph={{
          url: 'https://testnet.0xtrip.xyz/',
          title: profile.bio,
          description: profile.bio,
          siteName: 'lensbook',
        }}
        twitter={{
          handle: profile.handle,
          site: '@https://testnet.0xtrip.xyz',
          cardType: 'summary_large_image',
        }}
      />

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
          {profile && <Publications profile={profile} currentProfile={currentProfile} />}
        </div>
      </div>
    </>
  );

}

function Publications({ profile, currentProfile }: { profile: Profile, currentProfile: Profile }) {
  let { data: publications } = usePublications({
    profileId: profile.id,
    limit: 10,
    observerId: currentProfile && currentProfile.id,
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
