import { Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import React from "react";

interface Assignment {
  id: string;
  title: string;
}

interface Specialized {
  id: string;
  title: string;
  difficulty: string;
}

interface Error {
  name: string;
  id?: string;
  index?: number;
}

interface Props {
  hasPreRequisites: boolean;
  setHasPreRequisites: (value: boolean) => void;
  preRequisiteType: string;
  setPreRequisiteType: (value: string) => void;
  selectedPreRequisite: string;
  setSelectedPreRequisite: (value: string) => void;
  publish: string;
  setPublish: (value: string) => void;
  createModule: () => void;
  modules: { title: string; id: string }[];
  assignments: Assignment[];
  isSubmitting: boolean;
  specialized: Specialized[];
  moduleId: string;
  isRemedial: boolean;
  handleAddSection: () => void;
  specializedType: string;
  handleNext?: () => void;
  inputErrors: Error[];
}

const AddModuleFooter = ({
  hasPreRequisites,
  setHasPreRequisites,
  preRequisiteType,
  setPreRequisiteType,
  selectedPreRequisite,
  setSelectedPreRequisite,
  publish,
  setPublish,
  createModule,
  modules,
  assignments,
  isSubmitting,
  specialized,
  moduleId,
  isRemedial,
  handleAddSection,
  specializedType,
  handleNext,
  inputErrors,
}: Props) => {
  return (
    <View style={[{ marginBottom: 100 }]}>
      <View>
        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={handleAddSection}
        >
          <Text style={globalStyles.submitButtonText}>Add Sub-section</Text>
        </TouchableOpacity>
        {!isRemedial && (
          <View style={globalStyles.cardContainer1}>
            <View>
              <Text style={globalStyles.text1}>Pre-requisite</Text>
              <View style={globalStyles.dropdownStyle}>
                <Picker
                  selectedValue={hasPreRequisites}
                  onValueChange={setHasPreRequisites}
                  mode={"dropdown"}
                >
                  <Picker.Item label="No Requirements" value={false} />
                  <Picker.Item label="Enable Pre-requisites" value={true} />
                </Picker>
              </View>
              {hasPreRequisites && (
                <View>
                  <Text style={globalStyles.text1}>Select Requirement</Text>
                  <View style={{ rowGap: 10 }}>
                    {inputErrors.some((err) => err.name === "preReqType") && (
                      <Text style={globalStyles.errorText}>
                        This field is required
                      </Text>
                    )}
                    <View
                      style={[
                        globalStyles.dropdownStyle,
                        inputErrors.some(
                          (err) => err.name === "preReqType",
                        ) && { borderColor: "red" },
                      ]}
                    >
                      <Picker
                        selectedValue={preRequisiteType}
                        onValueChange={setPreRequisiteType}
                        mode={"dropdown"}
                      >
                        <Picker.Item
                          label="Select"
                          value=""
                          enabled={preRequisiteType.trim() === ""}
                        />
                        <Picker.Item label="Module Completion" value="module" />
                        <Picker.Item label="Assignment" value="assignment" />
                        <Picker.Item
                          label="Specialized Activity"
                          value="specialized"
                        />
                      </Picker>
                    </View>

                    <View>
                      {inputErrors.some(
                        (err) => err.name === "preReqSelect",
                      ) && (
                        <Text style={globalStyles.errorText}>
                          This field is required
                        </Text>
                      )}
                      <View
                        style={[
                          globalStyles.dropdownStyle,
                          inputErrors.some(
                            (err) => err.name === "preReqSelect",
                          ) && { borderColor: "red" },
                        ]}
                      >
                        <Picker
                          selectedValue={selectedPreRequisite}
                          onValueChange={setSelectedPreRequisite}
                          mode={"dropdown"}
                        >
                          <Picker.Item
                            label="Select"
                            value=""
                            enabled={selectedPreRequisite.trim().length === 0}
                          />
                          {preRequisiteType === "module" &&
                            modules.map((item) => (
                              <Picker.Item
                                key={item.id}
                                label={item.title}
                                value={item.id}
                              />
                            ))}

                          {preRequisiteType === "assignment" &&
                            assignments.map((item) => (
                              <Picker.Item
                                key={item.id}
                                label={item.title}
                                value={item.id}
                              />
                            ))}

                          {preRequisiteType === "specialized" &&
                            specialized?.map((item) => (
                              <Picker.Item
                                key={item.id}
                                label={item.title}
                                value={item.id}
                              />
                            ))}
                        </Picker>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
            <View>
              <Text style={globalStyles.text1}>Publish</Text>

              <View style={globalStyles.dropdownStyle}>
                <Picker
                  selectedValue={publish}
                  onValueChange={setPublish}
                  mode={"dropdown"}
                >
                  <Picker.Item
                    label="Private (Not visible to students)"
                    value="private"
                  />
                  <Picker.Item
                    label="Public (Students can access)"
                    value="public"
                  />
                </Picker>
              </View>
            </View>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 70,
        }}
      >
        <TouchableOpacity
          style={[globalStyles.inactivityButton, { marginHorizontal: "auto" }]}
        >
          <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={
            specializedType === "auditory" && isRemedial
              ? handleNext
              : createModule
          }
          disabled={isSubmitting}
        >
          {specializedType === "auditory" ? (
            <Text style={globalStyles.submitButtonText}>
              {specializedType === "auditory" && isRemedial
                ? "Next"
                : moduleId
                  ? !isSubmitting
                    ? "Update"
                    : "Updating..."
                  : !isSubmitting
                    ? "Create"
                    : "Creating..."}
            </Text>
          ) : (
            <Text style={globalStyles.submitButtonText}>
              {isSubmitting
                ? moduleId
                  ? "Updating..."
                  : "Creating..."
                : moduleId
                  ? "Update"
                  : "Create"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddModuleFooter;
