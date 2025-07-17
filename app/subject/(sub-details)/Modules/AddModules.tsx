import React, { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import AddModuleFooter from "@/app/subject/(sub-details)/Modules/AddModuleFooter";
import AddModuleHeader from "@/app/subject/(sub-details)/Modules/AddModuleHeader";
import { useLocalSearchParams } from "expo-router";
import FileUpload from "@/components/FileUpload";
import { addModule } from "@/utils/modules";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  files: FileInfo[];
  videoLink?: string[];
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

const AddModules = () => {
  useHeaderConfig("Modules");
  const { subjectId, modules, assignments } = useLocalSearchParams<{
    subjectId: string;
    modules: string;
    assignments: string;
  }>();

  const moduleList = useMemo<string[]>(() => {
    try {
      const parsed: Module[] = JSON.parse(modules || "[]");
      return parsed.map((m) => m.title);
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

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [moduleFile, setModuleFile] = useState<FileInfo[]>([]);
  const [modulePosition, setModulePosition] = useState<string>("");
  const [subSections, setSubsections] = useState<ModuleSection[]>([
    { id: "0", title: "", description: "", files: [], videoLink: [] },
  ]);
  const [hasPreRequisites, setHasPreRequisites] = useState<boolean>(false);
  const [preRequisiteType, setPreRequisiteType] = useState<string>("");
  const [selectedPreRequisite, setSelectedPreRequisite] = useState<string>("");
  const [publish, setPublish] = useState<string>("private");
  const [inputErrors, setInputErrors] = useState<Error[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createModule = async () => {
    const errors: Error[] = [];

    if (!title.trim().length) {
      errors.push({ name: "title" });
    }
    if (!description.trim().length) {
      errors.push({ name: "description" });
    }

    // subSections.forEach((item) => {
    //   if (!item.title.trim().length) {
    //     errors.push({ name: "subTitle", id: item.id });
    //   }
    //   if (!item.description.trim().length) {
    //     errors.push({ name: "subDescription", id: item.id });
    //   }
    //
    //   if (!item.file) {
    //     if (!item.file && (!item.videoLink || item.videoLink.length === 0)) {
    //       errors.push({ name: "subFile", id: item.id });
    //     }
    //   }
    // });

    if (errors.length) {
      setInputErrors(errors);
      console.log(errors);
      return;
    }

    setInputErrors([]);

    setIsSubmitting(true);
    const res = await addModule(
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

  const Header = (
    <AddModuleHeader
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      setModuleFile={setModuleFile}
      modulePosition={modulePosition}
      setModulePosition={setModulePosition}
      inputErrors={inputErrors}
      modules={moduleList}
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
      isSubmitting={isSubmitting}
    />
  );

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <FlatList
        data={subSections}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        renderItem={({ item, index }) => (
          <View style={[globalStyles.cardContainer1, { marginTop: 0 }]}>
            {index === 0 && (
              <Text style={globalStyles.text1}>Sub-sections</Text>
            )}
            <View>
              <Text style={globalStyles.text1}>Sub-section Title</Text>
              {inputErrors.some(
                (err) => err.name === "subTitle" && err.id === item.id,
              ) && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <TextInput
                value={item.title}
                onChangeText={(value) => setSectionTitle(item.id, value)}
                style={[
                  globalStyles.textInputContainer,
                  inputErrors.some(
                    (err) => err.name === "subTitle" && err.id === item.id,
                  ) && {
                    borderColor: "red",
                  },
                ]}
              />
            </View>
            <View>
              <Text style={globalStyles.text1}>Description</Text>
              {inputErrors.some(
                (err) => err.name === "subDescription" && err.id === item.id,
              ) && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <TextInput
                value={item.description}
                onChangeText={(value) => setSectionDesc(item.id, value)}
                style={[
                  globalStyles.textInputContainer,
                  { minHeight: 150, textAlignVertical: "top" },
                  inputErrors.some(
                    (err) =>
                      err.name === "subDescription" && err.id === item.id,
                  ) && {
                    borderColor: "red",
                  },
                ]}
                multiline
              />
            </View>
            <View>
              <Text style={globalStyles.text2}>
                Image / PDF / PPT / Document Files
              </Text>
              {inputErrors.some(
                (err) => err.name === "subFile" && err.id === item.id,
              ) && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <FileUpload
                handleFiles={(file: FileInfo[]) => {
                  setSectionFile(item.id, file);
                }}
              />
            </View>
            {(item?.videoLink ?? []).map?.((video, idx) => (
              <View key={idx}>
                <Text style={globalStyles.text2}>
                  Accepts PDF, PPT, video, images, etc. (Max: 100MB per file)
                  Video Links (YouTube, etc.)
                </Text>
                {inputErrors.some(
                  (err) => err.name === "videoLink" && err.id === item.id,
                ) && (
                  <Text style={[globalStyles.errorText]}>
                    This field is required
                  </Text>
                )}
                <TextInput
                  value={video}
                  onChangeText={(value) => setSectionLink(item.id, value, idx)}
                  style={[
                    globalStyles.textInputContainer,
                    inputErrors.some(
                      (err) => err.name === "videoLink" && err.id === item.id,
                    ) && { borderColor: "red" },
                  ]}
                />
              </View>
            ))}
            <TouchableOpacity
              style={globalStyles.submitButton}
              onPress={() => handleAddLink(item.id)}
            >
              <Text style={globalStyles.submitButtonText}>Add Link</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default AddModules;
