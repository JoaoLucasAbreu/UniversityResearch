import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, H3, Input, Text, SizeTokens, TextArea, XStack, YStack, Form, Spinner, Label} from 'tamagui';
import { Search, GraduationCap } from 'lucide-react-native';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';

interface IFormInput {
  country: string;
  university: string;
};

interface IResponseData {
  country: string;
  alpha_two_code: string
  name: string;
};

export function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [itens, setItens] = useState<IResponseData[]>([]);
  const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm<IFormInput>({
    defaultValues: {
      country: '',
      university: ''
    }
  });

  const onSubmit = handleSubmit(data =>
    {if(data.country != '' || data.university != ''){
      fetchData(data);
    }}
  );

  const fetchData = async (data: IFormInput) => {
    setLoading(true);
    var url = 'http://universities.hipolabs.com/search?';
    if(data.country != ''){
      url = url + 'country=' + data.country + '&';
    }
    if(data.university != ''){
      url = url + 'name=' + data.university;
    }

    try {
      const response = await axios.get<IResponseData[]>(url);
      setItens(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View 
    style={styles.wrapper}
    >
      <YStack
      marginBottom={'$4'}
      alignItems='center'>
        <GraduationCap color={'#a4f74a'} size={80}/>
        <H3 color={'#8af21a'}>Procurador de Universidades</H3>
      </YStack>
      <Form
      onSubmit={onSubmit}>
        <YStack
          width={350}
          minHeight={120}
          overflow="hidden"
          space="$2"
          margin="$3"
          padding="$2"
          backgroundColor={'#ccff96'}
          borderRadius={'$5'}
          borderColor={'#a4f74a'}
          borderWidth={'2'}
        >
          <Controller
          control={control}
          rules={{
          required: false,
          }}
          render={({ field: { onChange, value } }) => (
            <Input flex={1} size={'$5'} placeholder={'País'} value={value} onChangeText={onChange} {...register("country")}/>
          )}
          name="country"
          />
          <XStack alignItems="center" space="$2">
            <Controller
            control={control}
            rules={{
            required: false,
            }}
            render={({ field: { onChange, value } }) => (
              <Input flex={1} size={'$4'} value={value} onChangeText={onChange} placeholder={'Universidade'} {...register("university")}/>
            )}
            name="university"
            />
            <Form.Trigger asChild>
             <Button 
              size={'$4'} 
              borderColor={'#a4f74a'}
              borderWidth={2}
              color={'#90de3d'}
              backgroundColor={'#deffba'}
              icon={Search}
              >
              </Button>
            </Form.Trigger>
          </XStack>
        </YStack>
      </Form>
      {loading && <Spinner size="large" color="#8af21a"/>}
      <YStack>
        {itens.map((item: any, index: number) => (
              <Text>{item.name}</Text>                        
        ))}
      </YStack>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});


