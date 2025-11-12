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

const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";

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
        {/* ActivityIndicator em branco */}
        <ActivityIndicator size="large" color="#FFFFFF" /> 
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
      {/* Header em branco*/}
      <Text style={styles.header}>Catálogo de Frutos do Mar</Text>
      
      <TextInput
        placeholder="Buscar receita por nome (em inglês)..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        placeholderTextColor="#888"
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

// 7. Estilos (Styles)
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#014572", 
        paddingTop: 10,
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#014572", 
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFFFFF', 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#B0C4DE',
        color: '#014572', 
    },

    centerText: { 
        color: "#FFFFFF",
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
   
    mutedText: { 
        color: "#E0E0E0", 
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FFD700', 
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
        backgroundColor: "#FFFFFF", 
        padding: 12,
        borderRadius: 10, 
        borderColor: "#ADD8E6",
        borderWidth: 1,
        fontSize: 16,
    },
    mealCard: {
        flexDirection: 'row',
        backgroundColor: "#FFFFFF", 
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
        color: '#333',
        marginBottom: 4,
    },
    mealId: { 
        color: "#999",
        fontSize: 12,
        fontStyle: 'italic',
    },
});