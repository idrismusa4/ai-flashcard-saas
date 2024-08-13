export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
  
    const router = useRouter()
    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
          }))
      }
      
    useEffect(() => {
        async function getFlashcards() {
          if (!user) return
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            setFlashcards(collections)
          } else {
            await setDoc(docRef, { flashcards: [] })
          }
        }
        getFlashcards()
      }, [user])
      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id || index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id || flashcard.name)}>
                    <CardContent>
                      {flashcard.front && flashcard.back ? (
                        <Box sx={{ /* Styling for flip animation */ }}>
                          <div>
                            <div>
                              <Typography variant="h5" component="div">
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="h5" component="div">
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      ) : (
                        <Typography variant="h5" component="div">
                          {flashcard.name}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      );
  }