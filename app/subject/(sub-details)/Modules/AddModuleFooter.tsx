import { Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";

interface Assignment {
  id: string;
  title: string;
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
  modules: string[];
  assignments: Assignment[];
  isSubmitting: boolean;
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
}: Props) => {
  return (
    <View style={[{ marginBottom: 100 }]}>
      <TouchableOpacity
        style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
      >
        <Text style={globalStyles.submitButtonText}>Add Sub-section</Text>
      </TouchableOpacity>
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
                <View style={globalStyles.dropdownStyle}>
                  <Picker
                    selectedValue={preRequisiteType}
                    onValueChange={setPreRequisiteType}
                    mode={"dropdown"}
                  >
                    <Picker.Item
                      label="Select"
                      value=""
                      enabled={preRequisiteType.trim().length === 0}
                    />
                    <Picker.Item label="Module Completion" value="module" />
                    <Picker.Item label="Assignment" value="assignment" />
                  </Picker>
                </View>

                <View style={globalStyles.dropdownStyle}>
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
                        <Picker.Item key={item} label={item} value={item} />
                      ))}

                    {preRequisiteType === "assignment" &&
                      assignments.map((item) => (
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={[globalStyles.inactivityButton, { marginHorizontal: "auto" }]}
        >
          <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={createModule}
          disabled={isSubmitting}
        >
          <Text style={globalStyles.submitButtonText}>
            {isSubmitting ? "Creating..." : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddModuleFooter;
