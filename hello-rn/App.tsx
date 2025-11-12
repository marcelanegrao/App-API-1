import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView, 
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

type MealListItem = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

// Endpoint: Receitas de Frutos do Mar (Seafood)
const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";

// Cores para o Tema Escuro
const COLOR_PRIMARY_DARK = "#014572"; // Fundo Azul Marinho
const COLOR_SURFACE_DARK = "#002b47ff"; // Cards e Superfícies escuras
const COLOR_INPUT_DARK = "#002b47ff"; // Fundo do Input
const COLOR_TEXT_LIGHT = "#FFFFFF"; // Texto Principal
const COLOR_TEXT_MUTED = "#B0B0B0"; // Texto Secundário

export default function App() {
  const [meals, setMeals] = useState<MealListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchMeals() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }
      
      const data = await response.json();
      
      if (data && data.meals) {
        setMeals(data.meals as MealListItem[]);
      } else {
        setMeals([]);
      }
    } catch (e: any) {
      console.error("Fetch error:", e);
      setError("Falha ao carregar o catálogo de Frutos do Mar.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && meals.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLOR_TEXT_LIGHT} /> 
        <Text style={styles.centerText}>Carregando receitas de frutos do mar...</Text>
      </SafeAreaView>
    );
  }

  if (error && meals.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMeals}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: MealListItem }) => (
    <View style={styles.mealCard}>
      <Image 
        source={{ uri: item.strMealThumb }} 
        style={styles.mealImage} 
        resizeMode="cover" 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.mealTitle}>{item.strMeal}</Text>
        <Text style={styles.mealId}>Categoria: Seafood</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Catálogo de Frutos do Mar</Text>
      
      <TextInput
        placeholder="Buscar receita por nome (em inglês)..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        placeholderTextColor={COLOR_TEXT_MUTED}
      />

      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => String(item.idMeal)}
        onRefresh={fetchMeals}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={styles.mutedText}>Nenhum resultado encontrado para "{searchQuery}".</Text>}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLOR_PRIMARY_DARK,
        paddingTop: 10,
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: COLOR_PRIMARY_DARK,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 15,
        backgroundColor: COLOR_SURFACE_DARK, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLOR_INPUT_DARK,
        color: COLOR_TEXT_LIGHT,
    },
    centerText: { 
        color: COLOR_TEXT_LIGHT,
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    mutedText: { 
        color: COLOR_TEXT_MUTED, 
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FFD700', // Dourado para contraste de erro
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#00BCD4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        marginHorizontal: 16,
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: COLOR_INPUT_DARK, 
        padding: 12,
        borderRadius: 10, 
        borderColor: "#ADD8E6",
        borderWidth: 1,
        fontSize: 16,
        color: COLOR_TEXT_LIGHT, 
    },
    mealCard: {
        flexDirection: 'row',
        backgroundColor: COLOR_SURFACE_DARK, 
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 10,
        borderRadius: 12,
        shadowColor: "#FFFFFF", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mealImage: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    mealTitle: { 
        fontWeight: "600", 
        fontSize: 17,
        color: COLOR_TEXT_LIGHT, 
        marginBottom: 4,
    },
    mealId: { 
        color: COLOR_TEXT_MUTED, 
        fontSize: 12,
        fontStyle: 'italic',
    },
});