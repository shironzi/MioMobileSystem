import React, { useMemo, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import AddModuleFooter from "@/app/subject/(sub-details)/Modules/AddModuleFooter";
import AddModuleHeader from "@/app/subject/(sub-details)/Modules/AddModuleHeader";
import { router, useLocalSearchParams } from "expo-router";
import {
  addModule,
  addRemedial,
  updateModule,
  updateRemedial,
} from "@/utils/modules";
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
  media: FileInfo[];
  videoLink: string[];
}

interface Error {
  name: string;
  id?: string;
  index?: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

interface Assignment {
  id: string;
  title: string;
}

interface Specialized {
  id: string;
  title: string;
  difficulty: string;
}

const AddModules = () => {
  useHeaderConfig("Modules");
  const {
    subjectId,
    moduleId,
    modules,
    assignments,
    specialized,
    moduleTitle = "",
    moduleDescription = "",
    position,
    encodedModulesFiles,
    encodedSubSections,
    prereq_status,
    visibility,
    specializedType,
    remedialModule,
    focus_ipa,
    encodedWordList,
  } = useLocalSearchParams<{
    subjectId: string;
    moduleId: string;
    modules: string;
    assignments: string;
    specialized: string;
    moduleTitle: string;
    moduleDescription: string;
    position: string;
    encodedModulesFiles: string;
    encodedSubSections: string;
    prereq_status: string;
    visibility: string;
    specializedType: string;
    remedialModule: string;
    focus_ipa: string;
    encodedWordList: string;
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
          media: (section.media || []).map((file: any) => ({
            name: file.name,
            uri: file.url,
          })),
          videoLink: section.video_links || [],
        }),
      );
    } catch {
      return [
        { id: "0", title: "", description: "", media: [], videoLink: [] },
      ];
    }
  }, [encodedSubSections]);

  const moduleList = useMemo<{ title: string; id: string }[]>(() => {
    try {
      const parsed: Module[] = JSON.parse(modules || "[]");
      return parsed.map((m) => ({ title: m.title, id: m.id }));
    } catch {
      return [];
    }
  }, [modules]);

  const assignmentList = useMemo<Assignment[]>(() => {
    try {
      const parsed: Assignment[] = JSON.parse(assignments || "[]");
      return parsed;
    } catch {
      return [];
    }
  }, [assignments]);

  const SpecializedList = useMemo<Specialized[]>(() => {
    try {
      const parsed: Specialized[] = JSON.parse(specialized || "[]");
      return parsed;
    } catch {
      return [];
    }
  }, [specialized]);

  const [title, setTitle] = useState<string>(moduleTitle);
  const [description, setDescription] = useState<string>(moduleDescription);
  const [moduleFile, setModuleFile] = useState<FileInfo[]>(moduleFiles);
  const [modulePosition, setModulePosition] = useState<string>(position);
  const [subSections, setSubsections] = useState<ModuleSection[]>(
    SubSectionList.length
      ? SubSectionList
      : [{ id: "0", title: "", description: "", media: [], videoLink: [] }],
  );
  const [hasPreRequisites, setHasPreRequisites] = useState<boolean>(
    prereq_status === "true",
  );
  const [preRequisiteType, setPreRequisiteType] = useState<string>("");
  const [selectedPreRequisite, setSelectedPreRequisite] = useState<string>("");
  const [publish, setPublish] = useState<string>(visibility ?? "private");
  const [inputErrors, setInputErrors] = useState<Error[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

    if (subSections.length > 0) {
      subSections.forEach((item) => {
        if (!item.title.trim()) {
          errors.push({ name: "subsection", id: item.id });
        }

        if (!item.description.trim()) {
          errors.push({ name: "subsection", id: item.id });
        }
      });
    }

    console.log(hasPreRequisites);
    if (hasPreRequisites) {
      if (!preRequisiteType || preRequisiteType.trim() === "") {
        errors.push({ name: "preReqType" });
      }
      if (!selectedPreRequisite || selectedPreRequisite.trim() === "") {
        errors.push({ name: "preReqSelect" });
      }
    }

    console.log(errors);

    if (errors.length) {
      setInputErrors(errors);
      return;
    }

    setInputErrors([]);

    setIsSubmitting(true);
    const res = moduleId
      ? isRemedial
        ? await updateRemedial(
            subjectId,
            title,
            description,
            moduleFile,
            subSections,
            focusedIpa,
            moduleId,
          )
        : await updateModule(
            subjectId,
            moduleId,
            title,
            description,
            moduleFile,
            hasPreRequisites,
            publish,
            selectedPreRequisite,
            preRequisiteType,
            subSections,
            modulePosition,
          )
      : isRemedial
        ? await addRemedial(
            subjectId,
            title,
            description,
            moduleFile,
            subSections,
            focusedIpa,
          )
        : await addModule(
            subjectId,
            title,
            description,
            moduleFile,
            hasPreRequisites,
            publish,
            selectedPreRequisite,
            preRequisiteType,
            subSections,
            modulePosition,
          );

    console.log(res);

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

    console.log(res);

    setIsSubmitting(false);
  };

  const handleNext = async () => {
    const errors: Error[] = [];

    if (!title.trim().length) {
      errors.push({ name: "title" });
    }
    if (!description.trim().length) {
      errors.push({ name: "description" });
    }

    if (subSections.length > 0) {
      subSections.forEach((item) => {
        if (!item.title.trim()) {
          errors.push({ name: "subsection", id: item.id });
        }

        if (!item.description.trim()) {
          errors.push({ name: "subsection", id: item.id });
        }
      });
    }

    if (errors.length) {
      setInputErrors(errors);
      return;
    }

    setInputErrors([]);

    const encodedModulesFiles =
      encodeURIComponent(JSON.stringify(moduleFile)) ?? [];
    const encodedSubSections =
      encodeURIComponent(JSON.stringify(subSections)) ?? [];

    router.push({
      pathname: "/subject/(sub-details)/Modules/AddModuleAuditory",
      params: {
        subjectId: subjectId,
        title: title,
        description: description,
        moduleFiles: encodedModulesFiles,
        subSections: encodedSubSections,
        encodedWordList: encodedWordList,
        moduleId: moduleId,
      },
    });
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
        media: [],
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
      modules={moduleList}
      moduleId={moduleId}
      isRemedial={isRemedial}
      setIsRemedial={setIsRemedial}
      focusedIpa={focusedIpa}
      setFocusedIpa={setFocusIpa}
      specializedType={specializedType}
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
      modules={moduleList}
      assignments={assignmentList}
      specialized={SpecializedList}
      isSubmitting={isSubmitting}
      moduleId={moduleId}
      handleAddSection={handleAddSection}
      specializedType={specializedType}
      handleNext={handleNext}
      isRemedial={isRemedial}
      inputErrors={inputErrors}
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

export default AddModules;
