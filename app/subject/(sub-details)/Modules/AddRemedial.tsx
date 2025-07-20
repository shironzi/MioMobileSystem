import React, { useMemo, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import AddModuleFooter from "@/app/subject/(sub-details)/Modules/AddModuleFooter";
import AddModuleHeader from "@/app/subject/(sub-details)/Modules/AddModuleHeader";
import { router, useLocalSearchParams } from "expo-router";
import { addRemedial, updateRemedial } from "@/utils/modules";
import AddModuleItem from "@/app/subject/(sub-details)/Modules/AddModuleItem";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Subsection {
  description: string;
  media: File[];
  video_links: string[];
  title: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  files: FileInfo[];
  videoLink: string[];
}

interface Error {
  name: string;
  id?: string;
  index?: number;
}

const AddRemedial = () => {
  useHeaderConfig("Modules");
  const {
    subjectId,
    moduleId,
    moduleTitle = "",
    moduleDescription = "",
    position = "0",
    encodedModulesFiles,
    encodedSubSections,
    prereq_status,
    visibility,
    remedialModule = "false",
    focus_ipa = "",
  } = useLocalSearchParams<{
    subjectId: string;
    moduleId: string;
    moduleTitle: string;
    moduleDescription: string;
    position: string;
    encodedModulesFiles: string;
    encodedSubSections: string;
    prereq_status: string;
    visibility: string;
    remedialModule: string;
    focus_ipa: string;
  }>();

  const moduleFiles = useMemo<FileInfo[]>(() => {
    try {
      const parsed: any = JSON.parse(encodedModulesFiles || "[]");

      const mapped: FileInfo[] = parsed.map((file: any) => ({
        name: file.name,
        uri: file.url,
      }));

      return mapped;
    } catch {
      return [];
    }
  }, [encodedModulesFiles]);

  const SubSectionList = useMemo<ModuleSection[]>(() => {
    try {
      const parsed: Subsection[] = JSON.parse(encodedSubSections || "[]");

      return parsed.map(
        (section, index): ModuleSection => ({
          id: index.toString(),
          title: section.title,
          description: section.description,
          files: (section.media || []).map((file: any) => ({
            name: file.name,
            uri: file.url,
          })),
          videoLink: section.video_links || [],
        }),
      );
    } catch {
      return [
        { id: "0", title: "", description: "", files: [], videoLink: [] },
      ];
    }
  }, [encodedSubSections]);

  const [title, setTitle] = useState<string>(moduleTitle);
  const [description, setDescription] = useState<string>(moduleDescription);
  const [moduleFile, setModuleFile] = useState<FileInfo[]>(moduleFiles);
  const [modulePosition, setModulePosition] = useState<string>(position);
  const [subSections, setSubsections] = useState<ModuleSection[]>(
    SubSectionList.length
      ? SubSectionList
      : [{ id: "0", title: "", description: "", files: [], videoLink: [] }],
  );
  const [hasPreRequisites, setHasPreRequisites] = useState<boolean>(
    prereq_status === "true",
  );
  const [preRequisiteType, setPreRequisiteType] = useState<string>("");
  const [selectedPreRequisite, setSelectedPreRequisite] = useState<string>("");
  const [publish, setPublish] = useState<string>(visibility);
  const [inputErrors, setInputErrors] = useState<Error[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>("");
  const [isRemedial, setIsRemedial] = useState<boolean>(
    remedialModule === "true",
  );
  const [focusedIpa, setFocusIpa] = useState<string>(focus_ipa);

  const createModule = async () => {
    const errors: Error[] = [];

    if (!title.trim().length) {
      errors.push({ name: "title" });
    }
    if (!description.trim().length) {
      errors.push({ name: "description" });
    }

    if (isRemedial && !focusedIpa.trim().length) {
      errors.push({ name: "focus_ipa" });
    }

    if (errors.length) {
      setInputErrors(errors);
      console.log(errors);
      return;
    }

    setInputErrors([]);

    setIsSubmitting(true);
    const res = moduleId
      ? await updateRemedial(
          subjectId,
          title,
          description,
          moduleFile,
          subSections,
          focusedIpa,
          moduleId,
        )
      : await addRemedial(
          subjectId,
          title,
          description,
          moduleFile,
          subSections,
          focusedIpa,
        );

    if (res.success) {
      Alert.alert(
        "Success",
        res.message,
        [
          {
            text: "OK",
            onPress: () => {
              {
                moduleId && router.back();
              }
              router.back();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert("Failed", res.message);
    }

    setIsSubmitting(false);
  };

  const setSectionTitle = (id: string, title: string) => {
    setSubsections((prevSubsections) =>
      prevSubsections.map((item) =>
        item.id === id ? { ...item, title } : item,
      ),
    );
  };

  const setSectionDesc = (id: string, description: string) => {
    setSubsections((prevSubsections) =>
      prevSubsections.map((item) =>
        item.id === id ? { ...item, description } : item,
      ),
    );
  };

  const setSectionFile = (id: string, files: FileInfo[]) => {
    setSubsections((prevSubsections) =>
      prevSubsections.map((item) =>
        item.id === id ? { ...item, files } : item,
      ),
    );
  };

  const setSectionLink = (id: string, videoLink: string, index: number) => {
    setSubsections((prevSubsections) =>
      prevSubsections.map((section) => {
        if (section.id === id) {
          const updatedLinks = Array.isArray(section.videoLink)
            ? [...section.videoLink]
            : [];
          updatedLinks[index] = videoLink;
          return {
            ...section,
            videoLink: updatedLinks,
          };
        }
        return section;
      }),
    );
  };

  const handleAddLink = (id: string) => {
    setSubsections((prevSubsections) =>
      prevSubsections.map((section) => {
        if (section.id === id) {
          const updatedLinks = Array.isArray(section.videoLink)
            ? [...section.videoLink, ""]
            : [""];
          return {
            ...section,
            videoLink: updatedLinks,
          };
        }
        return section;
      }),
    );
  };

  const deleteSectionLink = (id: string, idx: number) => {
    setSubsections((prevSubsections) =>
      prevSubsections.map((section) => {
        if (section.id === id) {
          const updatedLinks = section.videoLink.filter(
            (_, index) => index !== idx,
          );
          return {
            ...section,
            videoLink: updatedLinks,
          };
        }
        return section;
      }),
    );
  };

  const handleAddSection = () => {
    setSubsections((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        title: "",
        description: "",
        files: [],
        videoLink: [],
      },
    ]);
  };

  const Header = (
    <AddModuleHeader
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      setModuleFile={setModuleFile}
      moduleFile={moduleFile}
      modulePosition={modulePosition}
      setModulePosition={setModulePosition}
      inputErrors={inputErrors}
      modules={[]}
      moduleId={moduleId}
      isRemedial={isRemedial}
      setIsRemedial={setIsRemedial}
      focusedIpa={focusedIpa}
      setFocusedIpa={setFocusIpa}
    />
  );

  const Footer = (
    <AddModuleFooter
      hasPreRequisites={hasPreRequisites}
      setHasPreRequisites={setHasPreRequisites}
      preRequisiteType={preRequisiteType}
      setPreRequisiteType={setPreRequisiteType}
      selectedPreRequisite={selectedPreRequisite}
      setSelectedPreRequisite={setSelectedPreRequisite}
      publish={publish}
      setPublish={setPublish}
      createModule={createModule}
      modules={[]}
      assignments={[]}
      specialized={[]}
      isSubmitting={isSubmitting}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      moduleId={moduleId}
      isRemedial={isRemedial}
      handleAddSection={handleAddSection}
      specializedType={""}
    />
  );

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <FlatList
        data={subSections}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        renderItem={({ item, index }) => (
          <AddModuleItem
            key={index}
            index={index}
            item={item}
            inputErrors={inputErrors}
            setSectionTitle={setSectionTitle}
            setSectionDesc={setSectionDesc}
            setSectionFile={setSectionFile}
            setSectionLink={setSectionLink}
            handleAddLink={handleAddLink}
            deleteSectionLink={deleteSectionLink}
          />
        )}
      />
    </View>
  );
};

export default AddRemedial;
